'use client';

import React, { FC, useContext, useEffect, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteLesson } from '../libs/server-actions/lessons-actions';
import LessonForm from './lesson-form';
import { useRouter } from 'next/navigation';
import { ConfirmationContext } from './app-wrapper';

type TLessonFormWrapperProps = {
  lessonId: string;
};

const LessonFormWrapper: FC<TLessonFormWrapperProps> = ({ lessonId }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const loadDeleteLessonConfirm = async () => {
      try {
        if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
          await deleteLesson(lessonId);
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

    loadDeleteLessonConfirm();
  }, [lessonId, confirmationContext]);

  const deleteLessonHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить этот урок?');
  };

  return (
    <>
      <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
        <FaEdit size={22} />
        <span className="ml-2">Редактировать</span>
      </Button>
      <Button variant="custom" className="ml-4" onClick={deleteLessonHandler}>
        <FaTrash size={16} />
        <span className="ml-2">Удалить</span>
      </Button>
      <div className="mt-5">{showEditForm && <LessonForm mode="edit" lessonId={lessonId} />}</div>
    </>
  );
};

export default LessonFormWrapper;
