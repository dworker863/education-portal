'use client';

import { Dispatch, FC, memo, SetStateAction, useContext, useMemo, useRef, useState } from 'react';
import { IExercise } from '../libs/interfaces/interfaces';
import { Button } from './button';
import EditorWrapper from './editor-wrapper';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';
import { useSession } from 'next-auth/react';
import { checkExercise, completeExercise } from '../libs/server-actions/exercises-actions';
import { getAchievementByCriteriaType, updateAchievementProgress } from '../libs/server-actions/achievements-actions';
import { ConfirmationContext } from './app-wrapper';

type TExerciseProps = {
  exercise: IExercise;
  setPassedTasks: Dispatch<SetStateAction<string[]>>;
  passedTasks: string[];
};

const Exercise: FC<TExerciseProps> = ({ exercise, passedTasks, setPassedTasks }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const session = useSession();
  const user = session?.data?.user;
  const containerRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<'exercise' | 'solution'>('exercise');
  const [isPassed, setIsPassed] = useState<'default' | 'success' | 'failed'>('default');
  const task = useMemo(() => (exercise?.task ? parse(DOMPurify.sanitize(exercise?.task)) : ''), [exercise?.task]);

  const checkExerciseHandler = async (exerciseName: string) => {
    if (!user) {
      console.error('Пользователь не авторизован');
      return;
    }

    try {
      const response = await fetch(
        `https://67e2eeaf97fc65f535382fe2.mockapi.io/exercises?exerciseName=${exerciseName}`,
      );
      const data = await response.json();

      console.log('Exercise: ', data);

      if (data === 'Not found' || data.length === 0 || data[0].failed > 0) {
        setIsPassed('failed');
        return;
      }

      const { updatedUser, achievementProgress } = await checkExercise(user.id, exercise.id);

      const achievementPrizeTickets = achievementProgress.filter((progress) => progress?.prizeTicket);

      setPassedTasks([...passedTasks, exercise.id]);

      await session.update({
        // ...session.data?.user,
        rating: updatedUser.rating,
        rank: updatedUser.rank,
        completeExercise: updatedUser.completedExercises,
        prizeTickets: [...(user.prizeTickets ?? []), ...achievementPrizeTickets],
      });

      setIsPassed('success');
    } catch (error) {
      confirmationContext?.setModalType('notification');
      confirmationContext?.setNotificationModalText((error as Error).message);
      confirmationContext?.setIsModalOpen(true);
      setIsPassed('failed');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div ref={containerRef} className="lesson-p mb-10">
        {task}
      </div>
      <p>
        Необходимый Уровень: <span className="text-customSecondary font-semibold">{exercise.requiredRank}</span>
      </p>
      <p className="mb-5">
        Баллы: <span className="text-customSecondary font-semibold">{exercise.prizePoints}</span>
      </p>
      <nav>
        <Button
          variant={tab === 'exercise' ? 'custom' : 'default'}
          className="rounded-es-none rounded-ee-none"
          onClick={() => setTab('exercise')}
        >
          Задание
        </Button>
        <Button
          variant={tab === 'solution' ? 'custom' : 'default'}
          className="rounded-es-none rounded-ee-none"
          onClick={() => setTab('solution')}
        >
          Решение
        </Button>
      </nav>
      <div className="mb-5" id={exercise.id}>
        <EditorWrapper userId={user.id} exercise={exercise} tab={tab} />
      </div>
      <div className="flex gap-4">
        <Button
          variant={isPassed === 'success' ? 'customSuccess' : isPassed === 'default' ? 'custom' : 'customFail'}
          onClick={async () => await checkExerciseHandler(exercise.name)}
        >
          {isPassed === 'success' && (
            <>
              <GoIssueClosed className="mr-2" size={20} />
              Пройдено
            </>
          )}
          {isPassed === 'failed' && (
            <>
              <SlClose className="mr-2" size={20} />
              Не Пройдено
            </>
          )}
          {isPassed === 'default' && 'Проверить'}
        </Button>
        {isPassed === 'failed' && (
          <Button variant="custom" onClick={() => setIsPassed('default')}>
            Сброс
          </Button>
        )}
      </div>
    </>
  );
};

export default memo(Exercise);
