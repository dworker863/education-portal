'use client';

import React, { Dispatch, FC, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CourseForm from './course-form';

type TCourseFormWrapperProps = {
  courseId: string;
  deleteCourseHandler: () => void;
  setCourseId: Dispatch<React.SetStateAction<string | null>>;
};

const CourseFormWrapper: FC<TCourseFormWrapperProps> = ({ courseId, deleteCourseHandler, setCourseId }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-2">
          <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
            <FaEdit size={22} />
            <span className="ml-2">Редактировать</span>
          </Button>
          <Button
            variant="custom"
            className="ml-4"
            onClick={() => {
              setCourseId(courseId);
              deleteCourseHandler();
            }}
          >
            <FaTrash size={16} />
            <span className="ml-2">Удалить</span>
          </Button>
        </div>
      </div>
      {showEditForm && <CourseForm mode="edit" courseId={courseId} />}
    </>
  );
};

export default CourseFormWrapper;
