'use client';

import React, { FC, useState } from 'react';
import CourseForm from './course-form';
import { ICourse } from '../interfaces/interfaces';
import CourseCard from './course-card';
import { deleteCourse } from '../libs/server-actions/courses-actions';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CourseFormWwrapper from './course-form-wrapper';

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
              <CourseFormWwrapper courseId={course.id} />
            </div>
          ))}
        <br />
      </section>
    </section>
  );
};

export default Courses;
