import { FC, useCallback, useContext, useState } from 'react';
import Modal from './modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import { IPrizeTicket } from '../libs/interfaces/interfaces';
import { ConfirmationContext } from './app-wrapper';
import { useSession } from 'next-auth/react';

type TConfirmationModalProps = {
  type: 'actionConfirmation' | 'usePrizeTicketConfirmation';
};

const ConfirmationModal: FC<TConfirmationModalProps> = ({ type }) => {
  const context = useContext(ConfirmationContext);
  const session = useSession();
  const discountTickets = session?.data?.user?.prizeTickets?.filter((ticket) => ticket.type === 'DISCOUNT');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const confirmHandler = useCallback(async () => {
    context?.setConfirmation(true);
    context?.setIsModalOpen(false);
    context?.setConfirmationModalType(false);

    if (type === 'usePrizeTicketConfirmation' && selectedTicketId) {
      await session.update({
        ...session.data?.user,
        prizeTickets: session.data?.user?.prizeTickets?.filter((ticket) => ticket.id !== selectedTicketId),
      });
      // console.log('Selected Prize Ticket ID:', selectedTicketId);
    }
  }, [context]);

  const cancelHandler = useCallback(() => {
    context?.setConfirmation(false);
    context?.setIsModalOpen(false);
    context?.setConfirmationModalType(false);
  }, [context]);

  return (
    <div className="h-screen flex items-center justify-center absolute w-full z-40 space-y-8 text-primary-foreground">
      <Modal type="confirmation" headerLabel="Подтвердите действие" backButtonLabel="Назад" showSocials={false}>
        <div className="space-y-8 text-primary-foreground">
          {type === 'usePrizeTicketConfirmation' && (
            <p>Если вы хотите использовать призовой билет, выберите билет из списка и подтвердите действие.</p>
          )}
          {type === 'actionConfirmation' && <p>Вы уверены?</p>}
          {type === 'usePrizeTicketConfirmation' && (
            <Select onValueChange={setSelectedTicketId} defaultValue="">
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
          )}
          <div className="flex gap-5 mt-5">
            <Button variant="custom" className="w-full" type="submit" onClick={confirmHandler}>
              {type === 'usePrizeTicketConfirmation' ? 'Использовать' : 'Подтвердить'}
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

export default ConfirmationModal;
