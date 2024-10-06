'use server';

import { auth, signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from './validation';
import { z } from 'zod';
import { getUserByEmail, getVerificationTokenByToken } from './utils';
import { VerificationError } from './errors';
import { prisma } from '@/prisma/prisma';

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

export const confirmVerification = async (token: string) => {
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      throw new Error('Token does not exists');
    }

    const hasExprired = new Date(existingToken.expires) < new Date();

    if (hasExprired) {
      throw new Error('Link expired');
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new Error('Email does not exists');
    }

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: 'Email verified' };
  } catch (error) {
    throw error;
  }
};
