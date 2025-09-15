'use client';

import React, { FC, useContext, useEffect, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import TestForm from './test-form';
import { deleteTest } from '../libs/server-actions/tests-actions';
import { ConfirmationContext } from './app-wrapper';

type TTestFormWrapperProps = {
  testId: string;
};

const TestFormWrapper: FC<TTestFormWrapperProps> = ({ testId }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDeleteTestConfirm = async () => {
      try {
        if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
          await deleteTest(testId);
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

    loadDeleteTestConfirm();
  }, [testId, confirmationContext]);

  const deleteTestHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить этот тест?');
  };

  return (
    <div>
      <div className="flex mb-5">
        <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
          <FaEdit size={22} />
          <span className="ml-2">Редактировать</span>
        </Button>
        <Button variant="custom" className="ml-4" onClick={deleteTestHandler}>
          <FaTrash size={16} />
          <span className="ml-2">Удалить</span>
        </Button>
      </div>
      {showEditForm && <TestForm mode="edit" testId={testId} />}
    </div>
  );
};

export default TestFormWrapper;
