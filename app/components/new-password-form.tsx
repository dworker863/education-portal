'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { newPasswordSchema } from '../libs/validation';
import { z } from 'zod';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';

import { useEffect, useState } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import {
  addNewPassword,
  confirmResetPasswordToken,
} from '../libs/server-actions/auth-actions';

const NewPasswordForm = () => {
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    confirmResetPasswordToken(token)
      .then((data) => {
        setTokenError('');
      })
      .catch((error) => {
        setTokenError(error.message);
      });
  }, [token]);

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    if (!email) {
      setSuccess('');
      setError('Invalid email');
      return null;
    }

    if (!token) {
      setSuccess('');
      setError('Invalid token');
      return null;
    }

    addNewPassword(token, email, values)
      .then((data) => {
        setError('');
        setSuccess(data.success);
      })
      .catch((error) => {
        setSuccess('');
        setError(error.message);
      });

    setTimeout(() => {
      router.push('/');
    }, 1500);
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit">Apply new password</Button>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
