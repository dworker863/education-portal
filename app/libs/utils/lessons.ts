import { prisma } from '@/prisma/prisma';

export const getAllLessons = async () => {
  try {
    const lessons = await prisma.lesson.findMany();
    return lessons;
  } catch (error) {
    console.error('Ошибка при получении уроков: ', error);
    throw error;
  }
};

export const getLessonByName = async (name: string) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        name,
      },
      include: {
        exercise: true,
      },
    });

    return lesson;
  } catch (error) {
    console.error('Ошибка при получении урока по названию: ', error);
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
    console.error('Ошибка при получении урока по ID: ', error);
    throw error;
  }
};
