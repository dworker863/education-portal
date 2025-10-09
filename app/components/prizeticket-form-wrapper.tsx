'use client';

import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PrizeTicketForm from './prizeticket-form';

type TPrizeTicketFormWrapperProps = {
  prizeTicketId: string;
  deletePrizeTicketHandler: () => Promise<void>;
  setPrizeTicketId: Dispatch<SetStateAction<string | null>>;
};

const PrizeTicketFormWrapper: FC<TPrizeTicketFormWrapperProps> = ({
  prizeTicketId,
  deletePrizeTicketHandler,
  setPrizeTicketId,
}) => {
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
              setPrizeTicketId(prizeTicketId);
              deletePrizeTicketHandler();
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
