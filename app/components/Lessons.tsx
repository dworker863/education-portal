'use client';

import React, { FC } from 'react';
import LessonForm from './LessonForm';
import { ILesson } from '../interfaces/interfaces';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteLesson } from '../libs/server-actions/lessons-actions';

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
              <div className="flex items-center">
                <Link href={`/course/${params.name}/${lesson.name}`}>
                  {lesson.name}
                </Link>
                <Button className="ml-4" onClick={async () => {}}>
                  <FaEdit size={22} color="#c2410c" />
                  <span className="ml-2 text-">Edit</span>
                </Button>
                <Button
                  className="ml-4"
                  onClick={async () => await deleteLesson(lesson.id)}
                >
                  <FaTrash size={16} color="#c2410c" />
                  <span className="ml-2 text-">Delete</span>
                </Button>
              </div>
            </li>
          ))}
      </ol>
    </section>
  );
};

export default Lessons;
