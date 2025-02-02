import React, { FC } from 'react';
import { IExercise, ILesson } from '../libs/interfaces/interfaces';
import Video from './video';
import Exercise from './exercise';

type TLessonCardProps = {
  lesson: ILesson | null;
  exercise: IExercise | null;
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, exercise }) => {
  return (
    <div className="flex w-full gap-10 p-10 bg-primary text-background rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div className="mb-10">{lesson?.content}</div>
        {lesson?.video && <Video src={lesson?.video} />}
      </div>
      <div className="w-2/4">{exercise && <Exercise exercise={exercise} />}</div>
    </div>
  );
};

export default LessonCard;
