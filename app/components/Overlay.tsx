'use client';

import React, { FC, useContext, useEffect } from 'react';
import { ModalContext } from './AppWrapper';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type TOverlayProps = {
  children: React.ReactNode;
};

const Overlay: FC<TOverlayProps> = ({ children }) => {
  const context = useContext(ModalContext);

  const router = useRouter();

  useEffect(() => {
    router.prefetch('/signin');
    router.prefetch('/signup');
  }, [router]);

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
