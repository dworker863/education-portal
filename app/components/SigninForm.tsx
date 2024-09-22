'use client';

import { FormEvent, useState } from 'react';
import { login } from '../libs/server-actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema } from '../libs/validation';
import { zodResolver } from '@hookform/resolvers/zod';
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
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

const SigninForm = () => {
  const [error, setError] = useState(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSubmit = async (provider: string, e: FormEvent) => {
    e.preventDefault();

    login(undefined, provider)
      .then((data) => {
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        {error && <ErrorMessage message={error} />}
        <Button type="submit">Sign In</Button>
      </form>
      <form onSubmit={handleSubmit.bind(null, 'google')}>
        <button type="submit">Sign In with Google</button>
      </form>
      <form onSubmit={handleSubmit.bind(null, 'github')}>
        <button type="submit">Sign In with Github</button>
      </form>
    </Form>
  );
};

export default SigninForm;
