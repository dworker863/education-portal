'use client';

import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/form';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import { useState, useTransition } from 'react';
import ErrorMessage from './error-message';
import SuccessMessage from './success-message';
import { resetPassword } from '../libs/server-actions/auth-actions';

const ResetPasswordForm = () => {
  const [isPending, startTransiton] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    startTransiton(async () => {
      try {
        const response = await resetPassword(values);

        setError(null);
        setSuccess(response.success);
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
    <Form {...form}>
      <form className="space-y-8 text-primary-foreground" onSubmit={form.handleSubmit(onSubmit)}>
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
        <Button variant="custom" type="submit" disabled={isPending}>
          Отправить
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
