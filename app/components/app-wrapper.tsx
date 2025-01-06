'use client';

import { SessionProvider } from 'next-auth/react';
import React, { createContext, FC, useState } from 'react';

type TModalContext = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ModalContext = createContext<TModalContext | null>(null);

type TAppWrapperProps = {
  children: React.ReactNode;
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
