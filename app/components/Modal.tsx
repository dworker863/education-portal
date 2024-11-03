'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import React, { FC, useState } from 'react';
import ModalHeader from './ModalHeader';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';
import Socials from './Socials';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoCloseSharp } from 'react-icons/io5';

type TModalProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocials?: boolean;
};

const Modal: FC<TModalProps> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocials,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!isModalOpen) return null;

  return (
    <Card className="w-[500px] relative">
      <CardHeader>
        <ModalHeader label={headerLabel} />
        <Button
          className="absolute right-0 top-0"
          variant="link"
          onClick={() => {
            setIsModalOpen(false);
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
