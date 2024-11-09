'use client';

import React, { FC, useState } from 'react';
import Editor from './Editor';
import { ILesson } from '../interfaces/interfaces';
import Video from './Video';

type TLessonCardProps = {
  lesson: ILesson | null;
};

const LessonCard: FC<TLessonCardProps> = ({ lesson }) => {
  const [tab, setTab] = useState('exercise');
  return (
    <div className="flex w-full p-10 bg-white text-black rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Content</h2>
        {lesson?.content}
        {lesson?.video && <Video src={lesson?.video} />}
      </div>
      <div className="w-2/4 text-center">
        <h2 className="mb-5">Exercise</h2>
        <nav>
          <button onClick={() => setTab('exercise')}>Exercise</button>
          <button onClick={() => setTab('solution')}>Solution</button>
        </nav>
        <div id="test">
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
