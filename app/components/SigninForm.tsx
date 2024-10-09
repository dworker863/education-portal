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
import { useSearchParams } from 'next/navigation';
import SuccessMessage from './SuccessMessage';
import Link from 'next/link';

const SigninForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider'
      : '';

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values)
      .then((data) => {
        if (data.success) {
          setError('');
          setSuccess(data.success);
        }

        if (data.twoFactor) {
          setError('');
          setTwoFactor(data.twoFactor);
          setSuccess('Confirmation code sent');
        }
      })
      .catch((error) => {
        setSuccess('');
        setError(error.message);
      });
  };

  const handleSubmitWithProvider = async (provider: string, e: FormEvent) => {
    e.preventDefault();

    login(undefined, provider)
      .then((data) => {
        if (data.success) {
          setError('');
          setSuccess(data.success);
        }

        if (data.twoFactor) {
          setError('');
          setTwoFactor(data.twoFactor);
          setSuccess('Confirmation code sent');
        }
      })
      .catch((error) => {
        setSuccess('');
        setError(error.message);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!twoFactor && (
          <>
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
                  <Button variant="link" asChild>
                    <Link href="/reset-password">Forgot password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {twoFactor && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation Code</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(error || urlError) && <ErrorMessage message={error || urlError} />}
        {success && <SuccessMessage message={success} />}
        <Button type="submit">{!twoFactor ? 'Sign In' : 'Confirm'}</Button>
      </form>
      <form onSubmit={handleSubmitWithProvider.bind(null, 'google')}>
        <button type="submit">Sign In with Google</button>
      </form>
      <form onSubmit={handleSubmitWithProvider.bind(null, 'github')}>
        <button type="submit">Sign In with Github</button>
      </form>
    </Form>
  );
};

export default SigninForm;
