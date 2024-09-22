'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { AuthError } from 'next-auth';
import { fileUpload, getUserByEmail } from './utils';
import bcrypt from 'bcryptjs';
import { loginSchema, registrationSchema } from './validation';
import { z } from 'zod';

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
      await signIn('credentials', {
        email: parsedCredentials.data.email,
        password: parsedCredentials.data.password,
        redirectTo: '/',
      });
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
  }

  const errorMessage = JSON.parse(parsedCredentials.error?.message!)[0];

  throw new Error(errorMessage);
};

export const registration = async (
  values: z.infer<typeof registrationSchema>,
  file: File,
) => {
  const parsedValues = await registrationSchema.safeParse(values);

  if (parsedValues.success) {
    try {
      const isUserExists = await getUserByEmail(values.email);

      if (isUserExists) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(values.password, 10);

      const birthDate = new Date(values.birthDate as string).toISOString();

      const imagePath = await fileUpload(file);

      if (typeof imagePath === 'string') {
        await prisma.user.create({
          data: {
            email: values.email,
            name: values.username,
            password: hashedPassword,
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate,
            image: imagePath,
          },
        });

        return { success: 'You successfully registred' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const errorMessage = JSON.parse(parsedValues?.error?.message! || '')[0];

  throw new Error(errorMessage);
};

export const logout = async () => {
  await signOut();
};
