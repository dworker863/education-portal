'use client';

import { SessionProvider } from 'next-auth/react';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

type TModalContext = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ModalContext = createContext<TModalContext | null>(null);

type TAppWrapperProps = {
  children: ReactNode;
};

const AppWrapper: FC<TAppWrapperProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SessionProvider>
      <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
        {children}
      </ModalContext.Provider>
    </SessionProvider>
  );
};

export default AppWrapper;
