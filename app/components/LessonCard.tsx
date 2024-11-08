import React, { FC } from 'react';
import Editor from './Editor';
import { ILesson } from '../interfaces/interfaces';
import Video from './Video';

type TLessonCardProps = {
  lesson: ILesson | null;
};

const LessonCard: FC<TLessonCardProps> = ({ lesson }) => {
  return (
    <div className="flex w-full p-10 bg-white text-black rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Content</h2>
        {lesson?.content}
        {lesson?.video && <Video src={lesson?.video} />}
      </div>
      <div className="w-2/4 text-center">
        <h2 className="mb-5">Exercise</h2>
        <div id="test">
          <Editor userId="test" />
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
