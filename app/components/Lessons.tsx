'use client';

import React, { FC } from 'react';
import LessonForm from './lesson-form';
import { ILessonPartial } from '../libs/interfaces/interfaces';
import Link from 'next/link';
import LessonFormWrapper from './lesson-form-wrapper';
import slugify from 'slugify';

type TLessonsProps = {
  courseId?: string;
  lessons?: ILessonPartial[];
  name: string;
};

const Lessons: FC<TLessonsProps> = ({ courseId, lessons, name }) => {
  return (
    <section>
      <LessonForm courseId={courseId} mode="create" />
      <ol className="px-5 list-decimal">
        {lessons &&
          lessons.length > 0 &&
          lessons.map((lesson) => {
            const lessonName = slugify(lesson.name, { locale: 'ru' });
            return (
              <li key={lesson.id + lesson.name}>
                <div className="mb-5">
                  <Link href={`/courses/${name}/${lessonName}`}>{lesson.name}</Link>
                  <LessonFormWrapper lessonId={lesson.id} />
                </div>
              </li>
            );
          })}
      </ol>
    </section>
  );
};

export default Lessons;
