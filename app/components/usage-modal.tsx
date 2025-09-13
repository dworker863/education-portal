'use client';

import { useCallback, useContext, useState } from 'react';
import Modal from './modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import { ConfirmationContext } from './app-wrapper';
import { useSession } from 'next-auth/react';
import { disconnectPrizeTicketFromUser } from '../libs/server-actions/prizeticket-actions';

const UsageModal = () => {
  const context = useContext(ConfirmationContext);
  const session = useSession();
  const user = session?.data?.user;
  const discountTickets = session?.data?.user?.prizeTickets?.filter((ticket) => ticket.type === 'DISCOUNT');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const confirmHandler = useCallback(async () => {
    try {
      if (!user) {
        throw new Error('Пользователь не аутентифицирован');
      }

      if (!selectedTicketId) {
        throw new Error('Призовой билет не выбран');
      }

      context?.setIsModalOpen(false);

      if (selectedTicketId) {
        context?.setDiscount(user.prizeTickets?.find((ticket) => ticket.id === selectedTicketId)?.percent || 0);

        await disconnectPrizeTicketFromUser(selectedTicketId, user.id);

        await session.update({
          ...session.data?.user,
          prizeTickets: session.data?.user?.prizeTickets?.filter((ticket) => ticket.id !== selectedTicketId),
        });

        context?.setConfirmation(true);
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса: ', error);
    }
  }, [context, selectedTicketId, session]);

  const cancelHandler = useCallback(() => {
    context?.setConfirmation(false);
    context?.setIsModalOpen(false);
    context?.setModalType(null);
  }, [context]);

  return (
    <div className="h-screen flex items-center justify-center absolute w-full z-40 space-y-8 text-primary-foreground">
      <Modal type="confirmation" headerLabel="Подтвердите действие" backButtonLabel="Назад" showSocials={false}>
        <div className="space-y-8 text-primary-foreground">
          <p>Если вы хотите использовать призовой билет, выберите билет из списка и подтвердите действие.</p>

          <Select
            onValueChange={(params) => {
              setSelectedTicketId(params);
              console.log('Selected Prize Ticket ID:', selectedTicketId);
            }}
            defaultValue=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите призовой билет" />
            </SelectTrigger>
            <SelectContent>
              {discountTickets?.map((ticket) => (
                <SelectItem key={ticket.id} value={ticket.id}>
                  {ticket.name} - {ticket.percent}% скидка
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>Вы уверены?</p>
          <div className="flex gap-5 mt-5">
            <Button variant="custom" className="w-full" type="submit" onClick={confirmHandler}>
              {user?.prizeTickets && user?.prizeTickets.length > 0 ? 'Использовать' : 'Подтвердить'}
            </Button>
            <Button variant="custom" className="w-full" type="submit" onClick={cancelHandler}>
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsageModal;
