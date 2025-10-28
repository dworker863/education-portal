'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/card';
import React, { FC, ReactNode, useContext, useEffect, useRef } from 'react';
import ModalHeader from './modal-header';
import { Button } from '@/app/components/button';
import Link from 'next/link';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from './app-wrapper';
import Socials from './socials';
import { useRouter, useSearchParams } from 'next/navigation';

type TModalProps = {
  type:
    | 'login'
    | 'login-page'
    | 'registration'
    | 'registration-page'
    | 'reset-password'
    | 'new-password'
    | 'edit-profile'
    | 'confirmation'
    | 'notification';
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref?: string;
  showSocials?: boolean;
};

const Modal: FC<TModalProps> = ({ children, type, headerLabel, backButtonLabel, backButtonHref, showSocials }) => {
  const searchParams = useSearchParams();
  const modalOpenParam = searchParams.get('modalopen');
  const context = useContext(ModalContext);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const modalCloseHandler = () => {
    context?.setIsModalOpen(false);

    if (type === 'registration-page' || type === 'new-password') {
      router.push('/');
      return;
    }

    if (type !== 'confirmation') {
      router.back();
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const isSelectElement = (event.target as HTMLElement).closest('span');
    const isRoleElement = (event.target as HTMLElement).matches('div[role="option"]');

    if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isSelectElement && !isRoleElement) {
      modalCloseHandler();
    }
  };

  useEffect(() => {
    if (type !== 'registration' && type !== 'registration-page') {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (modalOpenParam) {
      context?.setIsModalOpen(true);
    }
  }, [modalOpenParam, context]);

  if (!context?.isModalOpen && type !== 'new-password' && type !== 'registration-page' && type !== 'login-page')
    return null;

  return (
    <Card ref={modalRef} className="relative w-[500px] bg-customBlock h-min">
      <CardHeader>
        <ModalHeader label={headerLabel} type={type} />
        <Button className="absolute right-0 top-0" variant="link" onClick={modalCloseHandler}>
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
        {backButtonHref ? (
          <Button variant="link" className="w-full text-primary-foreground font-normal" size="sm" asChild>
            <Link href={backButtonHref}>Назад</Link>
          </Button>
        ) : (
          <Button
            variant="link"
            className="w-full text-primary-foreground font-normal"
            size="sm"
            onClick={modalCloseHandler}
          >
            Назад
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Modal;
