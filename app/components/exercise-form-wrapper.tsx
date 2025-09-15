'use client';

import { useRouter } from 'next/navigation';
import React, { FC, useContext, useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ExerciseForm from './exercise-form';
import { Button } from './button';
import { deleteExercise } from '../libs/server-actions/exercises-actions';
import { ConfirmationContext } from './app-wrapper';

type TExerciseFormWrapperProps = {
  exerciseId: string;
};

const ExerciseFormWrapper: FC<TExerciseFormWrapperProps> = ({ exerciseId }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDeleteExerciseConfirm = async () => {
      try {
        if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
          await deleteExercise(exerciseId);
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

    loadDeleteExerciseConfirm();
  }, [exerciseId, confirmationContext]);

  const deleteExerciseHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить это упражнение?');
  };

  return (
    <div>
      <div className="flex mb-5">
        <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
          <FaEdit size={22} />
          <span className="ml-2">Редактировать</span>
        </Button>
        <Button variant="custom" className="ml-4" onClick={deleteExerciseHandler}>
          <FaTrash size={16} />
          <span className="ml-2">Удалить</span>
        </Button>
      </div>
      {showEditForm && <ExerciseForm mode="edit" exerciseId={exerciseId} />}
    </div>
  );
};

export default ExerciseFormWrapper;
