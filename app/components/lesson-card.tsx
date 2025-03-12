'use client';

import React, { FC, useEffect, useRef } from 'react';
import { IExercise, ILesson, ITest } from '../libs/interfaces/interfaces';
import Video from './video';
import Exercise from './exercise';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Базовая тема
import 'prismjs/plugins/line-numbers/prism-line-numbers'; // Плагин для нумерации строк
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'; // Стили для нумерации строк
import Test from './test';

type TLessonCardProps = {
  lesson: ILesson | null;
  exercise: IExercise | null;
  test: ITest | null;
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, exercise, test }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = lesson?.content ? DOMPurify.sanitize(lesson?.content) : '';

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
      <div className="w-2/4">{exercise ? <Exercise exercise={exercise} /> : test ? <Test test={test} /> : ''}</div>
    </div>
  );
};

export default LessonCard;
