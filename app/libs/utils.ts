import { prisma } from '@/prisma/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
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
    throw error;
  }
};

export const fileUpload = async (file: File) => {
  if (!file || file.size === 0) {
    return new Error('No file uploaded');
  }

  try {
    const data = await file.arrayBuffer();
    const uploadPath = path.resolve('public/uploads', file.name);

    await fs.writeFile(uploadPath, Buffer.from(data));

    console.log('File successfully uploaded');

    return path.join('/uploads', file.name);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  console.log(token);

  const expires = new Date(new Date().getTime() + 600 * 1000);

  try {
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    throw error;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 600 * 1000);

  try {
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    throw error;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1000_000).toString();
  const expires = new Date(new Date().getTime() + 600 * 1000);

  try {
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
    console.log(error);
    throw error;
  }
};

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: {
          userId,
        },
      },
    );

    return twoFactorConfirmation;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const checkCredentials = async (email: string, password: string) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingUser.password!,
    );

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    return existingUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    throw error;
  }
};

export const getCourseByName = async (name: string) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        name,
      },
    });

    return course;
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (id: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    return course;
  } catch (error) {
    throw error;
  }
};

export const getAllLessons = async () => {
  try {
    const lessons = await prisma.lesson.findMany();
    return lessons;
  } catch (error) {
    throw error;
  }
};

export const getLessonByName = async (name: string) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        name,
      },
    });

    return lesson;
  } catch (error) {
    throw error;
  }
};

export const updateLesson = async (lessonId: string, exerciseId: string) => {
  try {
    const lesson = prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        exerciseId,
      },
    });

    return lesson;
  } catch (error) {
    throw error;
  }
};
