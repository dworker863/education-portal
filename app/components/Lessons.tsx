'use client';

import React, { FC } from 'react';
import LessonForm from './LessonForm';
import { ILesson } from '../interfaces/interfaces';
import Link from 'next/link';

type TLessonsProps = {
  courseId?: string;
  lessons: ILesson[];
  params: { name: string };
};

const Lessons: FC<TLessonsProps> = ({ courseId, lessons, params }) => {
  return (
    <section>
      <LessonForm courseId={courseId} />
      <ol className="px-5 list-decimal">
        {lessons.length > 0 &&
          lessons.map((lesson) => (
            <li key={lesson.id + lesson.name}>
              <Link href={`/course/${params.name}/${lesson.name}`}>
                {lesson.name}
              </Link>
            </li>
          ))}
      </ol>
    </section>
  );
};

export default Lessons;
