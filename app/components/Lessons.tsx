'use client';

import React, { FC, useState } from 'react';
import LessonForm from './lesson-form';
import { ILesson } from '../interfaces/interfaces';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteLesson } from '../libs/server-actions/lessons-actions';

type TLessonsProps = {
  courseId?: string;
  lessons: ILesson[];
  params: { name: string };
};

const Lessons: FC<TLessonsProps> = ({ courseId, lessons, params }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <section>
      <LessonForm courseId={courseId} mode="create" />
      <ol className="px-5 list-decimal">
        {lessons.length > 0 &&
          lessons.map((lesson) => (
            <li key={lesson.id + lesson.name}>
              <div className="flex items-center mb-5">
                <Link href={`/course/${params.name}/${lesson.name}`}>
                  {lesson.name}
                </Link>
                <Button
                  className="ml-4"
                  onClick={() => setShowEditForm(!showEditForm)}
                >
                  <FaEdit size={22} color="#c2410c" />
                  <span className="ml-2 text-">Редактировать</span>
                </Button>
                <Button
                  className="ml-4"
                  onClick={async () => await deleteLesson(lesson.id)}
                >
                  <FaTrash size={16} color="#c2410c" />
                  <span className="ml-2 text-">Удалить</span>
                </Button>
              </div>
              {showEditForm && <LessonForm mode="edit" lessonId={lesson.id} />}
            </li>
          ))}
      </ol>
    </section>
  );
};

export default Lessons;
