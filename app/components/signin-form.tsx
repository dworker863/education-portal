'use client';

import { useState } from 'react';
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
} from '@/app/components/form';
import { Input } from '@/app/components/input';
import { Button } from '@/app/components/button';
import ErrorMessage from './error-message';
import { useSearchParams } from 'next/navigation';
import SuccessMessage from './success-message';
import Link from 'next/link';
import { login } from '../libs/server-actions/auth-actions';

const SigninForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [twoFactor, setTwoFactor] = useState(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email уже используется другим провайдером'
      : '';

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values)
      .then((data) => {
        if (data?.success) {
          setError(null);
          setSuccess(data.success);
        }

        if (data?.twoFactor) {
          setError(null);
          setTwoFactor(data.twoFactor);
          setSuccess('Код подтверждения отправлен на email');
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} />
                  </FormControl>
                  <Button
                    className="px-0 font-normal"
                    variant="link"
                    size="sm"
                    asChild
                  >
                    <Link href="/reset-password">Забыли пароль?</Link>
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
                <FormLabel>Код подтверждения</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(error || urlError) && <ErrorMessage message={error || urlError} />}
        {success && <SuccessMessage message={success} />}
        <Button className="w-full" type="submit">
          {!twoFactor ? 'Войти' : 'Подтвердить'}
        </Button>
      </form>
    </Form>
  );
};

export default SigninForm;
