'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/prisma/prisma';

export const login = async (formData: FormData) => {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/',
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registration = async (formData: FormData) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  await signOut();
};
