'use client';

import React, { FC } from 'react';
import CourseForm from './course-form';
import { ICourse } from '../interfaces/interfaces';
import CourseCard from './course-card';
import CourseFormWrapper from './course-form-wrapper';

type TCoursesProps = {
  courses: ICourse[];
};

const Courses: FC<TCoursesProps> = ({ courses }) => {
  return (
    <section className="py-5">
      <h1 className="text-center mb-10">Courses</h1>
      <CourseForm mode="create" />
      <section>
        {courses.length > 0 &&
          courses.map((course) => (
            <div key={course.id}>
              <CourseCard key={course.id + course.name} course={course} />
              <CourseFormWrapper courseId={course.id} />
            </div>
          ))}
        <br />
      </section>
    </section>
  );
};

export default Courses;
