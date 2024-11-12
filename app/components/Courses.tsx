'use client';

import React, { FC, useState } from 'react';
import CourseForm from './course-form';
import { Button } from '@/app/components/button';
import { ICourse } from '../interfaces/interfaces';
import CourseCard from './course-card';

type TCoursesProps = {
  courses: ICourse[];
};

const Courses: FC<TCoursesProps> = ({ courses }) => {
  return (
    <section className="py-5">
      <h1 className="text-center mb-10">Courses</h1>
      <CourseForm />
      <section>
        {courses.length > 0 &&
          courses.map((course) => (
            <CourseCard key={course.id + course.name} course={course} />
          ))}
        <br />
      </section>
    </section>
  );
};

export default Courses;
