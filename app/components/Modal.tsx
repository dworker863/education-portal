'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/card';
import React, { FC, useContext, useEffect, useRef } from 'react';
import ModalHeader from './modal-header';
import { Button } from '@/app/components/button';
import Link from 'next/link';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from './app-wrapper';
import Socials from './socials';
import { useRouter } from 'next/navigation';

type TModalProps = {
  type: 'login' | 'registration' | 'reset-password' | 'new-password';
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocials?: boolean;
};

const Modal: FC<TModalProps> = ({ children, type, headerLabel, backButtonLabel, backButtonHref, showSocials }) => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const modalClose = () => {
    context?.setIsModalOpen(false);
    router.back(); // Закрыть модальное окно, вернувшись на предыдущий маршрут
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      modalClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  if (!context?.isModalOpen && type !== 'new-password') return null;

  return (
    <Card ref={modalRef} className="relative w-[500px] bg-primary ">
      <CardHeader>
        <ModalHeader label={headerLabel} type={type} />
        <Button className="absolute right-0 top-0" variant="link" onClick={modalClose}>
          <IoCloseSharp className="text-customPrimary" size={24} />
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <Button variant="link" className="w-full text-primary-foreground font-normal" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Modal;
