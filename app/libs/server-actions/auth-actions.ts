'use server';

import { auth, signIn, signOut } from '@/auth';
import {
  loginSchema,
  newPasswordSchema,
  resetPasswordSchema,
} from '../validation';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { sendResetPasswordEmail, sendTwoFactorToken } from '../utils/mail';
import { AuthError } from 'next-auth';
import { VerificationError } from '../errors';
import bcrypt from 'bcryptjs';
import { checkCredentials, getUserByEmail } from '../utils/auth';
import {
  generateResetPasswordToken,
  generateTwoFactorToken,
  getResetPasswordTokenByToken,
  getTwoFactorTokenByToken,
  getVerificationTokenByToken,
} from '../utils/tokens';

export const login = async (
  values?: z.infer<typeof loginSchema>,
  provider: string = 'credentials',
) => {
  try {
    const isLoggedIn = await auth();

    if (isLoggedIn) {
      throw new Error('Вы уже авторизованы');
    }

    if (!values) {
      await signIn(provider, {
        redirectTo: '/',
      });
    }

    const parsedCredentials = await loginSchema.safeParse(values);

    if (!parsedCredentials.success) {
      throw new Error(parsedCredentials.error.issues[0].message);
    }

    const { email, password, code } = parsedCredentials.data;
    const existingUser = await checkCredentials(email, password);

    if (existingUser && existingUser.emailVerified) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByToken(code);

        if (!twoFactorToken) {
          throw new Error('Неверный код');
        }

        const hasExprired = new Date(twoFactorToken.expires) < new Date();

        if (hasExprired) {
          throw new Error('Код больше не действителен');
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

    await signIn('credentials', {
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
};

export const logout = async () => {
  await signOut();
};

export const confirmVerification = async (token: string) => {
  try {
    if (!token) {
      throw new Error('Токен не существует');
    }

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      throw new Error('Token не найден');
    }

    const hasExprired = new Date(existingToken.expires) < new Date();

    if (hasExprired) {
      throw new Error('Ссылка больше не действительна');
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new Error('Пользователя с таким email не существует');
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

    return { success: 'Email подтвержден' };
  } catch (error) {
    console.error('Ошибка при обработке email-токена: ', error);
    throw error;
  }
};

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>,
) => {
  try {
    const parsedResult = await resetPasswordSchema.safeParse(values);

    if (!parsedResult.success) {
      throw new Error('Неверный email');
    }

    const { email } = parsedResult.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error('Пользователя с таким email не существует');
    }

    const resetPasswordToken = await generateResetPasswordToken(email);

    await sendResetPasswordEmail(
      resetPasswordToken.email,
      resetPasswordToken.token,
    );

    return { success: 'Ссылка сброса пароля отправлена на ваш email' };
  } catch (error) {
    console.log('Ошибка при сбросе пароля: ', error);
    throw error;
  }
};

export const confirmResetPasswordToken = async (token: string | null) => {
  try {
    if (!token) {
      throw new Error('Токен не существует');
    }

    const existingToken = await getResetPasswordTokenByToken(token);

    if (!existingToken) {
      throw new Error('Token не найден');
    }

    const hasExprired = new Date(existingToken.expires) < new Date();

    if (hasExprired) {
      throw new Error('Ссылка больше не действительна');
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new Error('Пользователя с таким email не существует');
    }

    return { success: 'Введите новый пароль' };
  } catch (error) {
    console.log('Ошибка при обработке resetPassword-токена: ', error);
    throw error;
  }
};

export const addNewPassword = async (
  token: string,
  email: string,
  values: z.infer<typeof newPasswordSchema>,
) => {
  try {
    const parsedResult = await newPasswordSchema.safeParse(values);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error?.issues[0].message);
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error('Пользователя с таким email не существует');
    }

    const { password } = parsedResult.data;

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

    return { success: 'Пароль успешно изменен' };
  } catch (error) {
    console.log('Ошибка при изменении пароля: ', error);
    throw error;
  }
};
