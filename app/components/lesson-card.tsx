'use client';

import React, { FC } from 'react';
import { IExercise, ILesson } from '../libs/interfaces/interfaces';
import Video from './video';
import Exercise from './exercise';
import DOMPurify from 'dompurify';

type TLessonCardProps = {
  lesson: ILesson | null;
  exercise: IExercise | null;
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, exercise }) => {
  const content = lesson?.content ? DOMPurify.sanitize(lesson?.content) : '';

  return (
    <div className="flex w-full gap-10 p-10 bg-primary text-primary-foreground rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div className="mb-10" dangerouslySetInnerHTML={{ __html: content }} />
        {lesson?.video && <Video src={lesson?.video} />}
      </div>
      <div className="w-2/4">{exercise && <Exercise exercise={exercise} />}</div>
    </div>
  );
};

export default LessonCard;
