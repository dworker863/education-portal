'use client';

import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/form';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import { useState } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { resetPassword } from '../libs/server-actions/auth-actions';

const ResetPasswordForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPassword(values)
      .then((data) => {
        setError(null);
        setSuccess(data.success);
      })
      .catch((error) => {
        setSuccess(null);
        setError(error.message);
      });
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit">Отправить</Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
