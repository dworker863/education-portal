'use server';

import { auth, signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import {
  loginSchema,
  newPasswordSchema,
  resetPasswordSchema,
} from './validation';
import { z } from 'zod';
import {
  checkCredentials,
  generateResetPasswordToken,
  generateTwoFactorToken,
  getResetPasswordTokenByToken,
  getTwoFactorTokenByToken,
  getUserByEmail,
  getVerificationTokenByToken,
} from './utils';
import { VerificationError } from './errors';
import { prisma } from '@/prisma/prisma';
import { sendResetPasswordEmail, sendTwoFactorToken } from './mail';
import bcrypt from 'bcryptjs';

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
      const { email, password, code } = parsedCredentials.data;
      const existingUser = await checkCredentials(email, password);

      console.log('LOGIN: ', parsedCredentials.data);

      if (existingUser) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByToken(code);

          if (!twoFactorToken) {
            throw new Error('Invalid code');
          }

          const hasExprired = new Date(twoFactorToken.expires) < new Date();

          if (hasExprired) {
            throw new Error('Code expired');
          }

          await prisma.twoFactorToken.delete({
            where: {
              id: twoFactorToken.id,
            },
          });

          await prisma.twoFactorConfirmation.create({
            data: {
              userId: existingUser.id,
            },
          });
        } else {
          const twoFactorToken = await generateTwoFactorToken(email);
          await sendTwoFactorToken(twoFactorToken.email, twoFactorToken.token);

          return { twoFactor: true };
        }
      }

      const res = await signIn('credentials', {
        email,
        password,
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

  try {
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

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>,
) => {
  const parsedValues = await resetPasswordSchema.safeParse(values);

  if (!parsedValues.success) {
    throw new Error('Invalid email');
  }

  const { email } = parsedValues.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new Error('Email does not exists');
  }

  const resetPasswordToken = await generateResetPasswordToken(email);
  await sendResetPasswordEmail(
    resetPasswordToken.email,
    resetPasswordToken.token,
  );

  return { success: 'Reset link sent to your email' };
};

export const confirmResetPasswordToken = async (token: string | null) => {
  if (!token) {
    throw new Error('Invalid token');
  }

  const existingToken = await getResetPasswordTokenByToken(token);

  if (!existingToken) {
    throw new Error('Token not found');
  }

  const hasExprired = new Date(existingToken.expires) < new Date();

  if (hasExprired) {
    throw new Error('Link has expired');
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new Error('Email does not exists');
  }

  try {
    return { success: 'Add new password' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addNewPassword = async (
  token: string,
  email: string,
  values: z.infer<typeof newPasswordSchema>,
) => {
  const parsedValues = await newPasswordSchema.safeParse(values);

  if (!parsedValues.success) {
    throw new Error(parsedValues.error?.issues[0].message);
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new Error('Email does not exists');
  }

  const { password } = parsedValues.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    const existingToken = await getResetPasswordTokenByToken(token);

    if (existingToken) {
      await prisma.resetPasswordToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    return { success: 'Password successfully changed' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
