'use client';

import { SessionProvider } from 'next-auth/react';
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { IAchievement, IExercise } from '../libs/interfaces/interfaces';
import ConfirmationModal from './confirmation-modal';
import UsageModal from './usage-modal';
import NotificationModal from './notification-modal';
import { usePathname } from 'next/navigation';
import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import ChatWrapper from './chat-wrapper';

type TModalContext = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

type TConfirmationContext = {
  confirmation: boolean;
  modalType: null | 'confirmation' | 'notification' | 'usage';
  setModalType: Dispatch<SetStateAction<null | 'confirmation' | 'notification' | 'usage'>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setConfirmation: Dispatch<SetStateAction<boolean>>;
  discount: number;
  setDiscount: Dispatch<SetStateAction<number>>;
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  confirmModalText: string;
  setConfirmModalText: Dispatch<SetStateAction<string>>;
  setUsageModalText: Dispatch<SetStateAction<string>>;
  setNotificationModalText: Dispatch<SetStateAction<string>>;
  setUsageModalTicketType: Dispatch<SetStateAction<null | 'DISCOUNT' | 'SUBSCRIPTION'>>;
};

type TChatRoomContext = {
  currentRoom: string;
  setCurrentRoom: Dispatch<SetStateAction<string>>;
};

export const ModalContext = createContext<TModalContext | null>(null);
export const ConfirmationContext = createContext<TConfirmationContext | null>(null);
export const AchievementsContext = createContext<IAchievement[] | null>(null);
export const ExercisesContext = createContext<IExercise[] | null>(null);
export const ChatRoomContext = createContext<TChatRoomContext | null>(null);

const client = new Ably.Realtime({ key: 'GknX1g.BmBquQ:zg4dlhftbbKmsO9-lXpNOHzKOfMIXEjnXO47eSKKCGE' });

type TAppWrapperProps = {
  achievements: IAchievement[];
  exercises: IExercise[];
  children: ReactNode;
};

const AppWrapper: FC<TAppWrapperProps> = ({ achievements, exercises, children }) => {
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<null | 'confirmation' | 'notification' | 'usage'>(null);
  const [confirmation, setConfirmation] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [confirmModalText, setConfirmModalText] = useState('');
  const [usageModalText, setUsageModalText] = useState('');
  const [notificationModalText, setNotificationModalText] = useState('');
  const [usageModalTicketType, setUsageModalTicketType] = useState<null | 'DISCOUNT' | 'SUBSCRIPTION'>(null);
  const [currentRoom, setCurrentRoom] = useState('main');

  useEffect(() => {
    if (
      !pathname.startsWith('/signin') &&
      !pathname.startsWith('/signup') &&
      !pathname.startsWith('/reset-password') &&
      !pathname.startsWith('/new-password') &&
      !pathname.startsWith('/edit-profile')
    ) {
      setIsModalOpen(false);
    }
    // Закрываем модалку при изменении URL
  }, [pathname]);

  return (
    <SessionProvider>
      <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
        <AchievementsContext.Provider value={achievements}>
          <ExercisesContext.Provider value={exercises}>
            <ConfirmationContext.Provider
              value={{
                confirmation,
                modalType,
                setModalType,
                setIsModalOpen,
                setConfirmation,
                discount,
                amount,
                setAmount,
                setDiscount,
                confirmModalText,
                setConfirmModalText,
                setUsageModalText,
                setNotificationModalText,
                setUsageModalTicketType,
              }}
            >
              {isModalOpen && modalType === 'confirmation' && <ConfirmationModal text={confirmModalText} />}
              {isModalOpen && modalType === 'notification' && <NotificationModal text={notificationModalText} />}
              {isModalOpen && modalType === 'usage' && (
                <UsageModal ticketType={usageModalTicketType} text={usageModalText} />
              )}
              <ChatRoomContext.Provider value={{ currentRoom, setCurrentRoom }}>
                <AblyProvider client={client}>
                  <ChatWrapper channelName={currentRoom}>{children}</ChatWrapper>
                </AblyProvider>
              </ChatRoomContext.Provider>
            </ConfirmationContext.Provider>
          </ExercisesContext.Provider>
        </AchievementsContext.Provider>
      </ModalContext.Provider>
    </SessionProvider>
  );
};

export default AppWrapper;
