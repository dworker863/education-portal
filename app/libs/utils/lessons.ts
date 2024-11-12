import { prisma } from '@/prisma/prisma';

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

export const getLessonById = async (id: string) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    return lesson;
  } catch (error) {
    throw error;
  }
};
