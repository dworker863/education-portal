'use client';

import React, { FC, useState } from 'react';
import { ILesson } from '../interfaces/interfaces';
import { Button } from '@/app/components/button';
import { cn } from '../libs/cn';
import Video from './video';
import Editor from './editor';

type TLessonCardProps = {
  lesson: ILesson | null;
};

const LessonCard: FC<TLessonCardProps> = ({ lesson }) => {
  console.log(lesson);

  const [tab, setTab] = useState('exercise');
  return (
    <div className="flex w-full gap-10 p-10 bg-white text-black rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div className="mb-10">{lesson?.content}</div>
        {lesson?.video && <Video src={lesson?.video} />}
      </div>
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Упражнение</h2>
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
        <div className="h-[400px]" id="test">
          {tab === 'exercise' ? (
            <Editor userId="test" mode="exercise" />
          ) : (
            <Editor userId="test" mode="solution" />
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
