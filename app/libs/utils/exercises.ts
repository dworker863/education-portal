import { prisma } from '@/prisma/prisma';
import { IExercise, ITest } from '../interfaces/interfaces';

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

export const checkCompletedExercises = (
  userCompletedExercises: (IExercise | ITest)[],
  lessonExercises?: (IExercise | ITest)[],
) => {
  if (userCompletedExercises.length === 0) {
    return [];
  }

  if (lessonExercises && lessonExercises.length > 0) {
    const matchedExercises = lessonExercises.filter((lessonExercise) => {
      return userCompletedExercises.some((userExercise) => userExercise.id === lessonExercise.id);
    });

    const matchedExercisesIds = matchedExercises.map((matchedExercise) => matchedExercise.id);

    return matchedExercisesIds;
  }

  return userCompletedExercises.map((exercise) => exercise.id);
};
