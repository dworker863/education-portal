import { FC, useCallback, useContext } from 'react';
import Modal from './modal';
import { Button } from './button';
import { ConfirmationContext } from './app-wrapper';

type TConfirmationModalProps = {
  text: string;
};

const ConfirmationModal: FC<TConfirmationModalProps> = ({ text }) => {
  const context = useContext(ConfirmationContext);

  const confirmHandler = useCallback(() => {
    context?.setConfirmation(true);
    context?.setIsModalOpen(false);
  }, [context]);

  const cancelHandler = useCallback(() => {
    context?.setConfirmation(false);
    context?.setIsModalOpen(false);
  }, [context]);

  return (
    <div className="h-screen flex items-center justify-center absolute w-full z-40 space-y-8 text-primary-foreground">
      <Modal type="confirmation" headerLabel="Подтвердите действие" backButtonLabel="Назад" showSocials={false}>
        <div className="space-y-8 text-primary-foreground">
          <p>{text}</p>
          <div className="flex gap-5 mt-5">
            <Button variant="custom" className="w-full" type="submit" onClick={confirmHandler}>
              Подтвердить
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
