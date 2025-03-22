'use client';

import { FC, useState } from 'react';
import { IExercise } from '../libs/interfaces/interfaces';
import { Button } from './button';
import EditorWrapper from './editor-wrapper';

type TExerciseProps = {
  exercise: IExercise;
};

const Exercise: FC<TExerciseProps> = ({ exercise }) => {
  const [tab, setTab] = useState<'exercise' | 'solution'>('exercise');

  return (
    <>
      <p className="mb-5">{exercise.task}</p>
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
      <div className="mb-5" id="test">
        <EditorWrapper exercise={exercise} tab={tab} />
      </div>
    </>
  );
};

export default Exercise;
