import bcrypt from 'bcryptjs';
import { prisma } from '@/prisma/prisma';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.error('Ошибка при получении пользователя по email: ', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.error('Ошибка при получении пользователя по ID: ', error);
    throw error;
  }
};

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch (error) {
    console.error('Ошибка при получении twoFactor-подтверждения файла: ', error);
    throw error;
  }
};

export const checkCredentials = async (email: string, password: string) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error('Неверные имя пользователя или пароль');
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password!);

    if (!passwordMatch) {
      throw new Error('Неверные имя пользователя или пароль');
    }

    return existingUser;
  } catch (error) {
    console.error('Ошибка при аутентификации пользователя: ', error);
    throw error;
  }
};
