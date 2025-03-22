'use client';

import { FC, useRef, useState } from 'react';
import { IExercise } from '../libs/interfaces/interfaces';
import { Button } from './button';
import EditorWrapper from './editor-wrapper';
import DOMPurify from 'dompurify';

type TExerciseProps = {
  exercise: IExercise;
};

const Exercise: FC<TExerciseProps> = ({ exercise }) => {
  const [tab, setTab] = useState<'exercise' | 'solution'>('exercise');
  const containerRef = useRef<HTMLDivElement>(null);
  const task = exercise?.task ? DOMPurify.sanitize(exercise?.task) : '';

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
        <EditorWrapper exercise={exercise} tab={tab} />
      </div>
    </>
  );
};

export default Exercise;
