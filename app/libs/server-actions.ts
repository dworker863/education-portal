'use server';

import { auth, signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from './validation';
import { z } from 'zod';
import { getUserByEmail } from './utils';
import { VerificationError } from './errors';

export const login = async (
  values?: z.infer<typeof loginSchema>,
  provider: string = 'credentials',
) => {
  const isLoggedIn = await auth();

  if (isLoggedIn) {
    throw new Error('You are already signed in!');
  }

  if (!values) {
    await signIn(provider, {
      redirectTo: '/',
    });
  }

  const parsedCredentials = await loginSchema.safeParse(values);

  if (parsedCredentials.success) {
    try {
      const res = await signIn('credentials', {
        email: parsedCredentials.data.email,
        password: parsedCredentials.data.password,
        redirectTo: '/',
      });
    } catch (error) {
      if (error instanceof AuthError) {
        if (
          error.type === 'AccessDenied' &&
          error.cause?.err instanceof VerificationError
        ) {
          return { success: error.cause?.err.message };
        }

        switch (error.type) {
          case 'CredentialsSignin':
            throw new Error('Invalid credentials.');
          default:
            throw new Error('Something went wrong.');
        }
      }
      throw error;
    }
  }

  const errorMessage = JSON.parse(parsedCredentials.error?.message!)[0];

  throw new Error(errorMessage);
};

export const logout = async () => {
  await signOut();
};
