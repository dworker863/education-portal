import React, { FC, useState } from 'react';
import { Button } from './button';
import { deleteCourse } from '../libs/server-actions/courses-actions';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CourseForm from './course-form';
import { useRouter } from 'next/navigation';

type TCourseFormWrapperProps = {
  courseId: string;
};

const CourseFormWrapper: FC<TCourseFormWrapperProps> = ({ courseId }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();
  return (
    <>
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
            onClick={async () => {
              await deleteCourse(courseId);
              router.refresh();
            }}
          >
            <FaTrash size={16} color="#c2410c" />
            <span className="ml-2 text-">Удалить</span>
          </Button>
        </div>
      </div>
      {showEditForm && <CourseForm mode="edit" courseId={courseId} />}
    </>
  );
};

export default CourseFormWrapper;
