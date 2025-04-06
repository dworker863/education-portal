'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { IExercise, ILesson, ITest } from '../libs/interfaces/interfaces';
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

type TLessonCardProps = {
  lesson: ILesson;
  exercises: IExercise[];
  tests: ITest[];
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, exercises, tests }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = lesson?.content ? DOMPurify.sanitize(lesson?.content) : '';
  const session = useSession();
  const userId = session?.data?.user.id as string;
  const courseId = lesson.courseId;

  const [isPassed, setIsPassed] = useState<'default' | 'success' | 'failed'>('default');
  const [passedExercises, setPassedExercises] = useState<string[]>([]);

  const practics = [...exercises, ...tests];
  const exercisesIds = exercises.map((exercise) => exercise.id);

  useEffect(() => {
    Prism.highlightAll();
  });

  console.log('LESSON CARD LESSON: ', lesson);

  const handleCheckLesson = () => {
    const result = checkLesson(passedExercises, exercisesIds);

    if (!result) {
      setIsPassed('failed');
    } else {
      updateCourseProgress(userId, lesson.courseId, lesson.id)
        .then((data) => {
          console.log(data?.result);

          setIsPassed('success');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="flex w-full gap-10 p-10 bg-primary text-primary-foreground rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div ref={containerRef} className="mb-10" dangerouslySetInnerHTML={{ __html: content }} />
        {lesson?.video && <Video src={lesson?.video} />}
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
            {practics.length > 0 &&
              practics.map((practice, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    {'variants' in practice ? (
                      <Test
                        key={index + practice.name}
                        test={practice}
                        passedExercises={passedExercises}
                        setPassedExercises={setPassedExercises}
                      />
                    ) : (
                      <Exercise
                        key={index + practice.name}
                        exercise={practice}
                        passedExercises={passedExercises}
                        setPassedExercises={setPassedExercises}
                      />
                    )}
                    <div className="flex justify-center mt-20">
                      {'variants' in practice ? (
                        <TestFormWrapper testId={practice.id} />
                      ) : (
                        <ExerciseFormWrapper exerciseId={practice?.id} />
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          {practics.length > 1 && <CarouselPrevious variant="customCircle" />}
          {practics.length > 1 && <CarouselNext variant="customCircle" />}
        </Carousel>
      </div>
    </div>
  );
};

export default LessonCard;
