'use client';

import React, { FC, useContext } from 'react';
import { ModalContext } from './app-wrapper';
import { cn } from '../libs/cn';

type TOverlayProps = {
  children: React.ReactNode;
};

const Overlay: FC<TOverlayProps> = ({ children }) => {
  const context = useContext(ModalContext);

  return (
    <div
      className={cn('h-screen w-full  absolute z-50', {
        'bg-black opacity-50 z-30': context?.isModalOpen,
      })}
    >
      {children}
    </div>
  );
};

export default Overlay;
