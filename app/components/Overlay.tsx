'use client';

import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { ModalContext } from './app-wrapper';
import { cn } from '../libs/cn';

type TOverlayProps = {
  children: ReactNode;
};

type TOverlayContext = {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
};

export const OverlayContext = createContext<TOverlayContext | null>(null);

const Overlay: FC<TOverlayProps> = ({ children }) => {
  const context = useContext(ModalContext);
  const [active, setActive] = useState<boolean>(context?.isModalOpen ?? false);

  useEffect(() => {
    setActive(context?.isModalOpen ?? false);
  }, [context?.isModalOpen]);

  return (
    <OverlayContext.Provider value={{ active, setActive }}>
      <div
        className={cn('h-screen w-full absolute z-50', {
          'bg-black opacity-50 z-30': active,
        })}
      >
        {children}
      </div>
    </OverlayContext.Provider>
  );
};

export default Overlay;
