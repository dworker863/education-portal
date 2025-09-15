'use client';

import React, { FC, useContext, useEffect, useState } from 'react';
import { Button } from './button';
import { deleteCourse } from '../libs/server-actions/courses-actions';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CourseForm from './course-form';
import { useRouter } from 'next/navigation';
import { ConfirmationContext } from './app-wrapper';

type TCourseFormWrapperProps = {
  courseId: string;
};

const CourseFormWrapper: FC<TCourseFormWrapperProps> = ({ courseId }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const loadDeleteCourseConfirm = async () => {
      try {
        if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
          await deleteCourse(courseId);
          confirmationContext.setConfirmation(false);
          confirmationContext.setIsModalOpen(false);

          if (!mounted) return;

          router.refresh();
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        confirmationContext?.setModalType('notification');
        confirmationContext?.setNotificationModalText((error as Error).message);
        confirmationContext?.setIsModalOpen(true);
        confirmationContext?.setConfirmation(false);
      }
    };

    loadDeleteCourseConfirm();
  }, [courseId, confirmationContext]);

  const deleteCourseHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить этот курс?');
  };

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-2">
          <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
            <FaEdit size={22} />
            <span className="ml-2">Редактировать</span>
          </Button>
          <Button variant="custom" className="ml-4" onClick={deleteCourseHandler}>
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
