'use client';

import { FC, useState } from 'react';
import { IExercise } from '../libs/interfaces/interfaces';
import { Button } from './button';
import EditorWrapper from './editor-wrapper';
import { cn } from '../libs/cn';

type TExerciseProps = {
  exercise: IExercise;
};

const Exercise: FC<TExerciseProps> = ({ exercise }) => {
  const [tab, setTab] = useState<'exercise' | 'solution'>('exercise');

  return (
    <>
      <h2 className="mb-5 text-center">{exercise.name}</h2>
      <p className="mb-5">{exercise.task}</p>
      <p>
        Необходимый Уровень: <span className="text-rose-600">{exercise?.requiredRank}</span>
      </p>
      <p className="mb-5">
        Баллы: <span className="text-rose-600">{exercise?.prizePoints}</span>
      </p>
      <nav>
        <Button
          variant={tab === 'exercise' ? 'default' : 'secondary'}
          className={cn('rounded-es-none rounded-ee-none', {
            'text-orange-600': tab === 'exercise',
          })}
          onClick={() => setTab('exercise')}
        >
          Задание
        </Button>
        <Button
          variant={tab === 'solution' ? 'default' : 'outline'}
          className={cn('rounded-es-none rounded-ee-none', {
            'text-orange-600': tab === 'solution',
          })}
          onClick={() => setTab('solution')}
        >
          Решение
        </Button>
      </nav>
      <div className="mb-5" id="test">
        <EditorWrapper exercise={exercise} tab={tab} />
      </div>
    </>
  );
};

export default Exercise;
