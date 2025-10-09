'use client';

import React, { FC, memo, useContext, useEffect, useState } from 'react';
import { IPrizeTicket } from '../libs/interfaces/interfaces';
import PrizeTicketCard from './prizeticket-card';
import PrizeTicketFormWrapper from './prizeticket-form-wrapper';
import PrizeTicketForm from './prizeticket-form';
import { ConfirmationContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import { deletePrizeTicket } from '../libs/server-actions/prizeticket-actions';
import Spinner from './spinner';

type TPrizeTicketsProps = {
  prizeTickets: IPrizeTicket[];
};

const PrizeTickets: FC<TPrizeTicketsProps> = ({ prizeTickets }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [prizeTicketId, setPrizeTicketId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDeletePrizeTicketConfirm = async () => {
      try {
        if (
          confirmationContext?.modalType === 'confirmation' &&
          confirmationContext.confirmation &&
          confirmationContext?.confirmModalText === 'Вы уверены, что хотите удалить этот призовой билет?'
        ) {
          if (!prizeTicketId) {
            throw new Error('Не выбран призовой билет для удаления');
          }
          setIsPending(true);

          await deletePrizeTicket(prizeTicketId);

          setIsPending(false);

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
  }, [prizeTicketId, confirmationContext, router]);

  const deletePrizeTicketHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить этот призовой билет?');
  };

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <section className="py-5">
          <h1 className="text-center mb-10">Prize Tickets</h1>
          <PrizeTicketForm mode="create" />
          <section>
            {prizeTickets.length > 0 &&
              prizeTickets.map((prizeTicket) => (
                <div key={prizeTicket.id}>
                  <PrizeTicketCard key={prizeTicket.id + prizeTicket.code} prizeTicket={prizeTicket} />
                  <PrizeTicketFormWrapper
                    prizeTicketId={prizeTicket.id}
                    deletePrizeTicketHandler={deletePrizeTicketHandler}
                    setPrizeTicketId={setPrizeTicketId}
                  />
                </div>
              ))}
            <br />
          </section>
        </section>
      )}
    </>
  );
};

export default memo(PrizeTickets);
