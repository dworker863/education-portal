'use client';

import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import { resetPassword } from '../libs/server-actions/auth-actions';

const ResetPasswordForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPassword(values)
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
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
        <Button type="submit">Reset email send</Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
