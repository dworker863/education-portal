'use client';

import { SessionProvider } from 'next-auth/react';
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import { IAchievement, IExercise } from '../libs/interfaces/interfaces';
import ConfirmationModal from './confirmation-modal';
import UsageModal from './usage-modal';

export type TModalContext = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export type TConfirmationContext = {
  confirmation: boolean;
  modalType: null | 'confirmation' | 'notification' | 'usage';
  setModalType: Dispatch<SetStateAction<null | 'confirmation' | 'notification' | 'usage'>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setConfirmation: Dispatch<SetStateAction<boolean>>;
  discount: number;
  setDiscount: Dispatch<SetStateAction<number>>;
  setConfirmModalText: Dispatch<SetStateAction<string>>;
  setUsageModalText: Dispatch<SetStateAction<string>>;
};

export const ModalContext = createContext<TModalContext | null>(null);
export const ConfirmationContext = createContext<TConfirmationContext | null>(null);
export const AchievementsContext = createContext<IAchievement[] | null>(null);
export const ExercisesContext = createContext<IExercise[] | null>(null);

type TAppWrapperProps = {
  achievements: IAchievement[];
  exercises: IExercise[];
  children: ReactNode;
};

const AppWrapper: FC<TAppWrapperProps> = ({ achievements, exercises, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<null | 'confirmation' | 'notification' | 'usage'>(null);
  const [confirmation, setConfirmation] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [confirmModalText, setConfirmModalText] = useState('');
  const [usageModalText, setUsageModalText] = useState('');

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
                setDiscount,
                setConfirmModalText,
                setUsageModalText,
              }}
            >
              {isModalOpen && modalType === 'confirmation' && <ConfirmationModal text={confirmModalText} />}
              {/* {isModalOpen && modalType === 'notification' && <NotificationModal />} */}
              {isModalOpen && modalType === 'usage' && <UsageModal text={usageModalText} />}
              {children}
            </ConfirmationContext.Provider>
          </ExercisesContext.Provider>
        </AchievementsContext.Provider>
      </ModalContext.Provider>
    </SessionProvider>
  );
};

export default AppWrapper;
