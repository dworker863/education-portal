'use client';

import { FC, useRef, useState } from 'react';
import { IExercise } from '../libs/interfaces/interfaces';
import { Button } from './button';
import EditorWrapper from './editor-wrapper';
import DOMPurify from 'dompurify';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';

type TExerciseProps = {
  exercise: IExercise;
};

const Exercise: FC<TExerciseProps> = ({ exercise }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'exercise' | 'solution'>('exercise');
  const [isPassed, setIsPassed] = useState<'default' | 'success' | 'failed'>('default');
  const task = exercise?.task ? DOMPurify.sanitize(exercise?.task) : '';

  const checkExercise = () => {
    fetch(`https://67e2eeaf97fc65f535382fe2.mockapi.io/test-result`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Полученные данные:', data);
        if (data[0].failed > 0) {
          setIsPassed('failed');
        } else {
          setIsPassed('success');
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        <EditorWrapper exercise={exercise} tab={tab} />
      </div>
      <div className="flex gap-4">
        <Button
          variant={isPassed === 'success' ? 'customSuccess' : isPassed === 'default' ? 'custom' : 'customFail'}
          onClick={() => checkExercise()}
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

export default Exercise;
