'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import React, { FC } from 'react';
import ModalHeader from './ModalHeader';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';
import Socials from './Socials';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <ModalHeader label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <Button
          variant="link"
          className="font-normal w-full"
          size="sm"
          asChild
          // onClick={handleClick}
        >
          <Link href={backButtonHref}>{backButtonLabel}</Link>
          {/* {backButtonLabel} */}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Modal;
