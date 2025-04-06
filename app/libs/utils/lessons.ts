import { prisma } from '@/prisma/prisma';

export const getLessonByName = async (name: string) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        name,
      },
      include: {
        exercises: true,
        tests: true,
        // course: {
        //   select: { id: true },
        // },
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

export const checkLesson = (passedExercises: string[], totalExercises: string[]) => {
  const result = (passedExercises.length / totalExercises.length) * 100;

  if (result < 75) {
    return false;
  } else {
    return true;
  }
};
