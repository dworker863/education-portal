'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/app/components/card';
import React, { FC, useContext } from 'react';
import ModalHeader from './modal-header';
import { Button } from '@/app/components/button';
import Link from 'next/link';
import { IoCloseSharp } from 'react-icons/io5';
import { ModalContext } from './app-wrapper';
import Socials from './socials';

type TModalProps = {
  type: 'login' | 'registration';
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocials?: boolean;
};

const Modal: FC<TModalProps> = ({
  children,
  type,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocials,
}) => {
  const context = useContext(ModalContext);
  if (!context?.isModalOpen) return null;

  return (
    <Card className="w-[500px] relative">
      <CardHeader>
        <ModalHeader label={headerLabel} type={type} />
        <Button
          className="absolute right-0 top-0"
          variant="link"
          onClick={() => {
            context.setIsModalOpen(false);
          }}
        >
          <IoCloseSharp size={24} />
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Modal;
