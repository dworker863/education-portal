'use client';

import { Button } from '@/components/ui/button';
import React, { FormEvent, useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { login } from '../libs/server-actions';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

const Socials = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const onSubmit = async (provider: string, e: FormEvent) => {
    e.preventDefault();

    login(undefined, provider)
      .then((data) => {
        if (data?.success) {
          setError(null);
          setSuccess(data.success);
        }
      })
      .catch((error) => {
        setSuccess(null);
        setError(error.message);
      });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={onSubmit.bind(null, 'google')}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={onSubmit.bind(null, 'github')}
      >
        <FaGithub />
      </Button>
    </div>
  );
};

export default Socials;
