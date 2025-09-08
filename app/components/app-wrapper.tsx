'use client';

import { SessionProvider } from 'next-auth/react';
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { IAchievement, IExercise, IPrizeTicket } from '../libs/interfaces/interfaces';
import ConfirmationModal from './confirmation-modal';

export type TModalContext = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export type TConfirmationContext = {
  confirmation: boolean;
  setConfirmationModalType: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setConfirmation: Dispatch<SetStateAction<boolean>>;
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
  const [confirmationModalType, setConfirmationModalType] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  return (
    <SessionProvider>
      <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
        <AchievementsContext.Provider value={achievements}>
          <ExercisesContext.Provider value={exercises}>
            <ConfirmationContext.Provider
              value={{ confirmation, setConfirmationModalType, setIsModalOpen, setConfirmation }}
            >
              {isModalOpen && confirmationModalType && <ConfirmationModal type="actionConfirmation" />}
              {children}
            </ConfirmationContext.Provider>
          </ExercisesContext.Provider>
        </AchievementsContext.Provider>
      </ModalContext.Provider>
    </SessionProvider>
  );
};

export default AppWrapper;
