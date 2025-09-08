import { FC, use, useCallback, useContext } from 'react';
import Modal from './modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import { IPrizeTicket } from '../libs/interfaces/interfaces';
import { ConfirmationContext } from './app-wrapper';

type TConfirmationModalProps = {
  type: 'actionConfirmation' | 'usePrizeTicketConfirmation';
  discountTickets?: IPrizeTicket[];
};

const ConfirmationModal: FC<TConfirmationModalProps> = ({ type, discountTickets }) => {
  const context = useContext(ConfirmationContext);

  const confirmHandler = useCallback(() => {
    context?.setConfirmation(true);
    context?.setIsModalOpen(false);
    context?.setConfirmationModalType(false);
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
            <Select onValueChange={(value) => {}} defaultValue="">
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
