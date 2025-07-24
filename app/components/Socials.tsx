'use client';

import { Button } from '@/app/components/button';
import React, { useState, useTransition } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { login } from '../libs/server-actions/auth-actions';

const Socials = () => {
  const [isPending, startTransiton] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = (provider: string) => {
    startTransiton(async () => {
      try {
        const resposnse = await login(undefined, provider);

        if (resposnse?.success) {
          setError(null);
          setSuccess(resposnse.success);
        }
      } catch (error) {
        setSuccess(null);
        console.error('Ошибка при выполнении запроса:', error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Что-то пошло не так. Попробуйте снова.');
        }
      }
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
        disabled={isPending}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={onSubmit.bind(null, 'github')}
        disabled={isPending}
      >
        <FaGithub />
      </Button>
    </div>
  );
};

export default Socials;
