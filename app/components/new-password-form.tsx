'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { newPasswordSchema } from '../libs/validation';
import { z } from 'zod';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';

import { useEffect, useState, useTransition } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { addNewPassword, confirmResetPasswordToken } from '../libs/server-actions/auth-actions';

const NewPasswordForm = () => {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    confirmResetPasswordToken(token)
      .then((data) => {
        setTokenError(null);
        setSuccess(data?.success);
      })
      .catch((error) => {
        setSuccess(null);
        setTokenError(error.message);
      });
  }, [token]);

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    startTransiton(() => {
      if (!email) {
        setSuccess(null);
        setError('Invalid email');
        return;
      }

      if (!token) {
        setSuccess(null);
        setError('Invalid token');
        return;
      }

      addNewPassword(token, email, values)
        .then((data) => {
          setError(null);
          setSuccess(data.success);
        })
        .catch((error) => {
          setSuccess(null);
          setError(error.message);
        });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    });
  };

  if (tokenError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorMessage message={tokenError} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-8 text-primary-foreground" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button variant="custom" type="submit" disabled={isPending}>
          Подтвердить
        </Button>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
