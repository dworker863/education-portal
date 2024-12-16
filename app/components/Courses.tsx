'use client';

import React, { FC, useState } from 'react';
import CourseForm from './course-form';
import { ICourse } from '../interfaces/interfaces';
import CourseCard from './course-card';
import { deleteCourse } from '../libs/server-actions/courses-actions';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';

type TCoursesProps = {
  courses: ICourse[];
};

const Courses: FC<TCoursesProps> = ({ courses }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <section className="py-5">
      <h1 className="text-center mb-10">Courses</h1>
      <CourseForm mode="create" />
      <section>
        {courses.length > 0 &&
          courses.map((course) => (
            <div key={course.id}>
              <CourseCard key={course.id + course.name} course={course} />
              <div className="flex justify-between mb-5">
                <div className="flex gap-2">
                  <Button
                    className="ml-4"
                    onClick={async () => setShowEditForm(!showEditForm)}
                  >
                    <FaEdit size={22} color="#c2410c" />
                    <span className="ml-2 text-">Редактировать</span>
                  </Button>
                  <Button
                    className="ml-4"
                    onClick={async () => await deleteCourse(course.id)}
                  >
                    <FaTrash size={16} color="#c2410c" />
                    <span className="ml-2 text-">Удалить</span>
                  </Button>
                </div>
              </div>
              {showEditForm && <CourseForm mode="edit" courseId={course.id} />}
            </div>
          ))}
        <br />
      </section>
    </section>
  );
};

export default Courses;
