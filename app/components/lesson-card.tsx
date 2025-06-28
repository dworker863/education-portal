'use client';

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { IExercise, ILesson, ILessonPartial, ITest } from '../libs/interfaces/interfaces';
import Video from './video';
import Exercise from './exercise';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Базовая тема
import 'prismjs/plugins/line-numbers/prism-line-numbers'; // Плагин для нумерации строк
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'; // Стили для нумерации строк
import Test from './test';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';
import TestFormWrapper from './test-form-wrapper';
import ExerciseFormWrapper from './exercise-form-wrapper';
import { Button } from './button';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';
import ErrorMessage from './error-message';
import { checkLesson } from '../libs/utils/lessons';
import { updateCourseProgress } from '../libs/server-actions/progress-action';
import { useSession } from 'next-auth/react';
import { checkCompletedExercises } from '../libs/utils/exercises';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { getAchievementByCriteriaType, updateAchievementProgress } from '../libs/server-actions/achievements-actions';

type TLessonCardProps = {
  lesson: ILesson;
  lessons: ILessonPartial[];
  exercises: IExercise[];
  tests: ITest[];
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, lessons, exercises, tests }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const content = lesson?.content ? DOMPurify?.sanitize(lesson?.content) : '';
  const session = useSession();
  const userId = session?.data?.user.id as string;

  const [isPassed, setIsPassed] = useState<'default' | 'success' | 'failed'>('default');
  const [passedTasks, setPassedTasks] = useState<string[]>([]);

  const tasks = useMemo(() => [...exercises, ...tests], [exercises, tests]);
  const completedTasks = useMemo(
    () => [...(session?.data?.user.completedExercises || []), ...(session?.data?.user.completedTests || [])],
    [session?.data?.user.completedExercises, session?.data?.user.completedTests],
  );
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const lessonIndex = lessons.findIndex((partialLesson) => partialLesson.name === lesson.name);
  // console.log('NEXT LESSON NAME: ', lessonIndex);
  const nextLessonName = lessonIndex !== lessons.length - 1 && slugify(lessons[lessonIndex + 1].name, { locale: 'ru' });

  const prevLessonName = lessonIndex !== 0 && slugify(lessons[lessonIndex - 1].name, { locale: 'ru' });

  useEffect(() => {
    Prism.highlightAll();
  });

  useEffect(() => {
    const lessonCompletedExercises = checkCompletedExercises(completedTasks, tasks);

    setPassedTasks(lessonCompletedExercises);
  }, [tasks, completedTasks]);

  const handleCheckLesson = async () => {
    const result = checkLesson(passedTasks, tasksIds);

    if (!result) {
      setIsPassed('failed');
    } else {
      setIsPassed('success');
      router.push(`./${nextLessonName}`);
      updateCourseProgress(userId, lesson.courseId, lesson.id)
        .then((data) => {})
        .catch((error) => {
          console.log(error);
        });

      const achievements = await getAchievementByCriteriaType(['COURSE_COMPLETION', 'COMBINATION']);

      await Promise.all(
        achievements.map((achievement) => {
          updateAchievementProgress(achievement.id, userId);
        }),
      );
    }
  };

  return (
    <div className="flex w-full gap-10 p-10 bg-primary text-primary-foreground rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div ref={containerRef} className="mb-10" dangerouslySetInnerHTML={{ __html: content }} />
        {lesson?.video && <Video src={lesson?.video} />}
        <div className="flex justify-between">
          {prevLessonName && (
            <Button variant="custom" onClick={() => router.push(`./${prevLessonName}`)}>
              Предыдущий урок
            </Button>
          )}
          {nextLessonName && (
            <Button
              variant={isPassed === 'success' ? 'customSuccess' : isPassed === 'default' ? 'custom' : 'customFail'}
              onClick={() => handleCheckLesson()}
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
              {isPassed === 'default' && 'Следующий урок'}
            </Button>
          )}
        </div>
        {isPassed === 'failed' && (
          <div className="mt-4">
            <ErrorMessage message="Чтобы перейти к следующему уроку Вы должны успешно выполнить 75% упражнений" />
          </div>
        )}
      </div>

      <div className="w-2/4">
        <h2 className="mb-5 text-center">Практика</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {tasks.length > 0 &&
              tasks.map((task, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    {'variants' in task ? (
                      <Test
                        key={index + task.name}
                        test={task}
                        passedTasks={passedTasks}
                        setPassedTasks={setPassedTasks}
                      />
                    ) : (
                      <Exercise
                        key={index + task.name}
                        exercise={task}
                        passedTasks={passedTasks}
                        setPassedTasks={setPassedTasks}
                      />
                    )}
                    <div className="flex justify-center mt-20">
                      {'variants' in task ? (
                        <TestFormWrapper testId={task.id} />
                      ) : (
                        <ExerciseFormWrapper exerciseId={task?.id} />
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          {tasks.length > 1 && <CarouselPrevious variant="customCircle" />}
          {tasks.length > 1 && <CarouselNext variant="customCircle" />}
        </Carousel>
      </div>
    </div>
  );
};

export default LessonCard;
