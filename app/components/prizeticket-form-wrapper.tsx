'use client';

import React, { FC, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PrizeTicketForm from './prizeticket-form';
import { deletePrizeTicket } from '../libs/server-actions/prizeticket-actions';

type TPrizeTicketFormWrapperProps = {
  prizeTicketId: string;
};

const PrizeTicketFormWrapper: FC<TPrizeTicketFormWrapperProps> = ({ prizeTicketId }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();
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
            onClick={async () => {
              await deletePrizeTicket(prizeTicketId);
              router.refresh();
            }}
          >
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
