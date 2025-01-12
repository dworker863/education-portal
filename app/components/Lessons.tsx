'use client';

import React, { FC } from 'react';
import LessonForm from './lesson-form';
import { ILesson } from '../interfaces/interfaces';
import Link from 'next/link';
import LessonFormWrapper from './lesson-form-wrapper';

type TLessonsProps = {
  courseId?: string;
  lessons: ILesson[];
  params: { name: string };
};

const Lessons: FC<TLessonsProps> = ({ courseId, lessons, params }) => {
  return (
    <section>
      <LessonForm courseId={courseId} mode="create" />
      <ol className="px-5 list-decimal">
        {lessons.length > 0 &&
          lessons.map((lesson) => (
            <li key={lesson.id + lesson.name}>
              <div className="mb-5">
                <Link href={`/course/${params.name}/${lesson.name}`}>
                  {lesson.name}
                </Link>
                <LessonFormWrapper lessonId={lesson.id} />
              </div>
            </li>
          ))}
      </ol>
    </section>
  );
};

export default Lessons;
