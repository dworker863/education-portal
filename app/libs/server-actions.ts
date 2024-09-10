'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { AuthError } from 'next-auth';
import { fileUpload, getUserByEmail } from './utils';
import bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(
      formData.get('password') as string,
      10,
    );

    const birthDate = new Date(
      formData.get('birthDate') as string,
    ).toISOString();

    const file = formData.get('file') as File;
    const imagePath = await fileUpload(file);

    if (typeof imagePath === 'string') {
      await prisma.user.create({
        data: {
          email: formData.get('email') as string,
          name: formData.get('name') as string,
          password: hashedPassword,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          birthDate,
          image: imagePath,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  await signOut();
};
