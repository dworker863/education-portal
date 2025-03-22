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
import { Button } from './button';
import { GrNext } from 'react-icons/gr';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';

type TLessonCardProps = {
  lesson: ILesson | null;
  exercises: IExercise[];
  tests: ITest[];
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, exercises, tests }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = lesson?.content ? DOMPurify.sanitize(lesson?.content) : '';
  const [practiceActive, setPracticeActive] = useState(0);

  const practics = [...exercises, ...tests];

  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <div className="flex w-full gap-10 p-10 bg-primary text-primary-foreground rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div ref={containerRef} className="mb-10" dangerouslySetInnerHTML={{ __html: content }} />
        {lesson?.video && <Video src={lesson?.video} />}
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
                      <Test key={index + practice.name} test={practice} />
                    ) : (
                      <Exercise key={index + practice.name} exercise={practice} />
                    )}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious variant="customCircle" />
          <CarouselNext variant="customCircle" />
        </Carousel>
      </div>
      {/* {tests.length > 0 && tests.map((test, index) => <Test key={index + test.name} test={test} />)}
      {exercises.length > 0 &&
        exercises.map((exercise, index) => <Exercise key={index + exercise.name} exercise={exercise} />)} */}
    </div>
  );
};

export default LessonCard;
