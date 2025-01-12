import { prisma } from '@/prisma/prisma';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error('Ошибка при получении email-токена по email: ', error);
    throw error;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error('Ошибка при получении email-токена по токену: ', error);
    throw error;
  }
};

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
      await prisma.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error('Ошибка при генерации email-токена: ', error);
    throw error;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await prisma.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });

    return resetPasswordToken;
  } catch (error) {
    console.error(
      'Ошибка при получении resetPassword-токена по email: ',
      error,
    );
    throw error;
  }
};

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await prisma.resetPasswordToken.findFirst({
      where: {
        token,
      },
    });

    return resetPasswordToken;
  } catch (error) {
    console.log('Ошибка при получении resetPassword-токена по токену: ', error);
    throw error;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken = await getResetPasswordTokenByEmail(email);

    if (existingToken) {
      await prisma.resetPasswordToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const resetPasswordToken = await prisma.resetPasswordToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return resetPasswordToken;
  } catch (error) {
    console.log('Ошибка при генерации resetPassword-токена: ', error);
    throw error;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return twoFactorToken;
  } catch (error) {
    console.error('Ошибка при получении twoFactor-токена email: ', error);
    throw error;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch (error) {
    console.error('Ошибка при получении twoFactor-токена по ID: ', error);
    throw error;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1000_000).toString();
    const expires = new Date(new Date().getTime() + 600 * 1000);

    const existingToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    if (existingToken) {
      await prisma.twoFactorToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return twoFactorToken;
  } catch (error) {
    console.error('Ошибка при генерации twoFactor-токена: ', error);
    throw error;
  }
};
