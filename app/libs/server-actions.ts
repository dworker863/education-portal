'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/prisma/prisma';

export const login = async (provider: string, formData: FormData) => {
  const isLoggedIn = await auth();

  if (isLoggedIn) {
    throw new Error('You are already signed in!');
  }

  try {
    if (provider === 'credentials') {
      console.log({ provider });
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
    throw error;
  }
};

export const registration = async (formData: FormData) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  await signOut();
};
