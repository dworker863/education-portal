'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { AuthError } from 'next-auth';
import { getUserByEmail } from './utils';

export const login = async (provider: string, formData: FormData) => {
  const isLoggedIn = await auth();

  if (isLoggedIn) {
    throw new Error('You are already signed in!');
  }

  try {
    if (provider === 'credentials') {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/',
      });
    } else {
      await signIn(provider, {
        redirectTo: '/',
      });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid credentials.');
        default:
          throw new Error('Something went wrong.');
      }
    }
    throw error;
  }
};

export const registration = async (formData: FormData) => {
  try {
    const isUserExists = await getUserByEmail(formData.get('email') as string);

    if (isUserExists) {
      throw new Error('User with this email already exists');
    }

    const user = await prisma.user.create({
      data: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
    });

    return Response.redirect(new URL('http://localhost:3000/'), 303);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  await signOut();
};
