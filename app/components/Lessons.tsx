'use client';

import React, { FC, useState } from 'react';
import LessonForm from './LessonForm';
import { ILesson } from '../interfaces/interfaces';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';

type TLessonsProps = {
  courseId?: string;
  lessons: ILesson[];
  params: { name: string };
};

const Lessons: FC<TLessonsProps> = ({ courseId, lessons, params }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <Button
        className="mb-5"
        variant="secondary"
        onClick={() => setShowForm(!showForm)}
      >
        <FaPlus size={20} color="#c2410c" />
        <span className="ml-2">{!showForm ? 'Add New Lesson' : 'Hide'}</span>
      </Button>
      {showForm && <LessonForm courseId={courseId} />}
      {lessons.length > 0 &&
        lessons.map((lesson) => (
          <Link key={lesson.id} href={`/course/${params.name}/${lesson.name}`}>
            {lesson.name}
          </Link>
        ))}
    </section>
  );
};

export default Lessons;
