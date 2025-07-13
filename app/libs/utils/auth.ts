import { promises as fs } from 'fs';
import path from 'path';
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

export const fileUpload = async (file: File) => {
  try {
    if (!file || file.size === 0) {
      return new Error('No file uploaded');
    }

    const data = await file.arrayBuffer();
    const uploadPath = path.resolve('public/uploads', file.name);

    await fs.writeFile(uploadPath, Buffer.from(data));

    return path.join('/uploads', file.name);
  } catch (error) {
    console.error('Ошибка при записи файла: ', error);
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
