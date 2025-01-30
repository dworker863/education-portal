import { prisma } from '@/prisma/prisma';

export const getAllExercises = async () => {
  try {
    const courses = await prisma.exercise.findMany();
    return courses;
  } catch (error) {
    console.error('Ошибка при получении упражнений: ', error);
    throw error;
  }
};

export const getExerciseById = async (id: string) => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: {
        id,
      },
    });

    return exercise;
  } catch (error) {
    console.error('Ошибка при получении упражнения по ID: ', error);
    throw error;
  }
};

export const getExerciseByName = async (name: string) => {
  try {
    const exercise = await prisma.exercise.findFirst({
      where: {
        name,
      },
    });

    return exercise;
  } catch (error) {
    console.error('Ошибка при получении упражнения по названию: ', error);
    throw error;
  }
};
