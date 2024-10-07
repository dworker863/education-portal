'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { newPasswordSchema } from '../libs/validation';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  addNewPassword,
  confirmResetPasswordToken,
} from '../libs/server-actions';
import { useEffect, useState } from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

const NewPasswordForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token) {
      return;
    }

    confirmResetPasswordToken(token)
      .then((data) => {
        setError('');
        setSuccess(data.success);
      })
      .catch((error) => {
        setSuccess('');
        setError(error.message);
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
      return null;
    }

    addNewPassword(email, values)
      .then((data) => {
        setError('');
        setSuccess(data.success);
      })
      .catch((error) => {
        setSuccess('');
        setError(error.message);
      });
  };

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
