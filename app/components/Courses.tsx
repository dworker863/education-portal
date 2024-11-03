'use client';

import React, { FC, useState } from 'react';
import CourseForm from './CourseForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ICourse } from '../interfaces/interfaces';
import { FaPlus } from 'react-icons/fa';

type TCoursesProps = {
  courses: ICourse[];
};

const Courses: FC<TCoursesProps> = ({ courses }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="py-5">
      <h1 className="text-center mb-10">Courses</h1>
      <Button
        className="mb-10"
        variant="secondary"
        onClick={() => setShowForm(!showForm)}
      >
        <FaPlus size={20} color="#c2410c" />
        <span className="ml-2">{!showForm ? 'Add New Course' : 'Hide'}</span>
      </Button>
      {showForm && <CourseForm />}
      <section>
        {courses.length > 0 &&
          courses.map((course) => (
            <Link key={course.name} href={`/course/${course.name}`}>
              {course.name}
            </Link>
          ))}
        <br />
      </section>
    </section>
  );
};

export default Courses;
