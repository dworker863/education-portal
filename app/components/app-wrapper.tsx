'use client';

import { getSession, SessionProvider } from 'next-auth/react';
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { IAchievement, IExercise } from '../libs/interfaces/interfaces';
import Modal from './modal';
import { Button } from './button';
import { Session } from 'next-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export type TModalContext = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export type TConfirmationContext = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  confirmation: boolean;
  setConfirmation: Dispatch<SetStateAction<boolean>>;
  confirmationModalType: boolean;
  setConfirmationModalType: Dispatch<SetStateAction<boolean>>;
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
  const [confirmation, setConfirmation] = useState(false);
  const [confirmationModalType, setConfirmationModalType] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const discountTickets = session?.user?.prizeTickets?.filter((ticket) => ticket.type === 'DISCOUNT');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const data = await getSession();

        if (!mounted) return;

        setSession(data);
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SessionProvider>
      <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
        <AchievementsContext.Provider value={achievements}>
          <ExercisesContext.Provider value={exercises}>
            <ConfirmationContext.Provider
              value={{
                isModalOpen,
                setIsModalOpen,
                confirmation,
                setConfirmation,
                confirmationModalType,
                setConfirmationModalType,
              }}
            >
              {isModalOpen && confirmationModalType && (
                <div className="h-screen flex items-center justify-center absolute w-full z-40 space-y-8 text-primary-foreground">
                  <Modal
                    type="confirmation"
                    headerLabel="Подтверждение"
                    backButtonLabel="Назад"
                    backButtonHref="./"
                    showSocials={false}
                  >
                    <div className="space-y-8 text-primary-foreground">
                      <p>
                        Если вы хотите использовать призовой билет, выберите билет из списка и подтвердите действие.
                      </p>
                      <Select onValueChange={setSelectedTicket} defaultValue="">
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
                      <div className="flex gap-5 mt-5">
                        <Button
                          variant="custom"
                          className="w-full"
                          type="submit"
                          onClick={() => {
                            setConfirmation(true);
                            setIsModalOpen(false);
                            setConfirmationModalType(false);
                          }}
                        >
                          Использовать
                        </Button>
                        <Button
                          variant="custom"
                          className="w-full"
                          type="submit"
                          onClick={() => {
                            setConfirmation(false);
                            setIsModalOpen(false);
                            setConfirmationModalType(false);
                          }}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>
              )}
              {children}
            </ConfirmationContext.Provider>
          </ExercisesContext.Provider>
        </AchievementsContext.Provider>
      </ModalContext.Provider>
    </SessionProvider>
  );
};

export default AppWrapper;
