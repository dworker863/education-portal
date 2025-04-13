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
  lessonExercises: (IExercise | ITest)[],
) => {
  console.log('userCompletedExercises: ', userCompletedExercises);
  console.log('lessonExercises: ', lessonExercises);

  if (userCompletedExercises.length === 0) {
    return [];
  }

  const matchedExercises = lessonExercises.filter((lessonExercise) => {
    return userCompletedExercises.some((userExercise) => userExercise.id === lessonExercise.id);
  });

  const matchedExercisesIds = matchedExercises.map((matchedExercise) => matchedExercise.id);

  console.log('matchedExercisesIds: ', matchedExercisesIds);

  return matchedExercisesIds;
};

export function calculateRank(rating: number): string {
  if (rating >= 6000) return 'S';
  if (rating >= 5000) return 'A+';
  if (rating >= 4300) return 'A';
  if (rating >= 3700) return 'A-';
  if (rating >= 3100) return 'B+';
  if (rating >= 2600) return 'B';
  if (rating >= 2100) return 'B-';
  if (rating >= 1600) return 'C+';
  if (rating >= 1200) return 'C';
  if (rating >= 800) return 'C-';
  if (rating >= 400) return 'D+';
  if (rating >= 200) return 'D';
  return 'D-';
}
