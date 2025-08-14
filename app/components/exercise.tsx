'use client';

import { Dispatch, FC, memo, SetStateAction, useMemo, useRef, useState } from 'react';
import { IExercise } from '../libs/interfaces/interfaces';
import { Button } from './button';
import EditorWrapper from './editor-wrapper';
import DOMPurify from 'dompurify';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';
import { useSession } from 'next-auth/react';
import { completeExercise } from '../libs/server-actions/exercises-actions';
import { getAchievementByCriteriaType, updateAchievementProgress } from '../libs/server-actions/achievements-actions';

type TExerciseProps = {
  exercise: IExercise;
  setPassedTasks: Dispatch<SetStateAction<string[]>>;
  passedTasks: string[];
};

const Exercise: FC<TExerciseProps> = ({ exercise, passedTasks, setPassedTasks }) => {
  const session = useSession();
  const userId = session?.data?.user.id as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<'exercise' | 'solution'>('exercise');
  const [isPassed, setIsPassed] = useState<'default' | 'success' | 'failed'>('default');
  const task = useMemo(() => (exercise?.task ? DOMPurify.sanitize(exercise?.task) : ''), [exercise?.task]);

  const checkExerciseHandler = async (exerciseName: string) => {
    try {
      const response = await fetch(
        `https://67e2eeaf97fc65f535382fe2.mockapi.io/exercises?exerciseName=${exerciseName}`,
      );
      const data = await response.json();
      console.log('Полученные данные:', data);

      if (data === 'Not found' || data.length === 0 || data[0].failed > 0) {
        setIsPassed('failed');
      } else {
        console.log('EXERCISE SESSION: ', session);

        const { user } = await completeExercise(userId, exercise.id);
        console.log(user);

        setPassedTasks([...passedTasks, exercise.id]);

        const achievements = await getAchievementByCriteriaType(['EXERCISE_COMPLETION', 'COMBINATION']);

        await Promise.all(
          achievements.map((achievement) => {
            updateAchievementProgress(achievement.id, user.id);
          }),
        );

        const result = await session.update({
          rating: user.rating || 0,
        });

        console.log('UPDATE RESULT: ', result);

        setIsPassed('success');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <>
      <div ref={containerRef} className="lesson-p mb-10" dangerouslySetInnerHTML={{ __html: task }} />
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
        <EditorWrapper userId={userId} exercise={exercise} tab={tab} />
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
