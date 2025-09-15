'use client';

import React, { FC, useContext, useEffect, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PrizeTicketForm from './prizeticket-form';
import { deletePrizeTicket } from '../libs/server-actions/prizeticket-actions';
import { ConfirmationContext } from './app-wrapper';

type TPrizeTicketFormWrapperProps = {
  prizeTicketId: string;
};

const PrizeTicketFormWrapper: FC<TPrizeTicketFormWrapperProps> = ({ prizeTicketId }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const loadDeletePrizeTicketConfirm = async () => {
      try {
        if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
          await deletePrizeTicket(prizeTicketId);
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

    loadDeletePrizeTicketConfirm();
  }, [prizeTicketId, confirmationContext]);

  const deletePrizeTicketHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить этот призовой билет?');
  };

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-2">
          <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
            <FaEdit size={22} />
            <span className="ml-2">Редактировать</span>
          </Button>
          <Button variant="custom" className="ml-4" onClick={deletePrizeTicketHandler}>
            <FaTrash size={16} />
            <span className="ml-2">Удалить</span>
          </Button>
        </div>
      </div>
      {showEditForm && <PrizeTicketForm mode="edit" prizeTicketId={prizeTicketId} />}
    </>
  );
};

export default PrizeTicketFormWrapper;
