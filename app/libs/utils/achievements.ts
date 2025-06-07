import { TExerciseCompletion } from './../interfaces/interfaces';
import { prisma } from '@/prisma/prisma';
import { getCourseByName } from './courses';
import { getExerciseByName } from './exercises';

export const getAchievementByName = async (name: string) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: {
        name,
      },
    });

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении курса по названию: ', error);
    throw error;
  }
};

export const getAchievementById = async (id: string) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: {
        id,
      },
    });

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении курса по ID: ', error);
    throw error;
  }
};

export const getInvalidNames = async (type: 'courses' | 'exercises', names: string[]) => {
  const idsCheckPromises = names.map(async (name) => {
    const entity = type === 'courses' ? await getCourseByName(name) : await getExerciseByName(name);
    return { name, exists: !!entity };
  });

  const results = await Promise.all(idsCheckPromises);

  return results.filter((result) => !result.exists).map((result) => result.name);
};

export const handleExerciseComplition = async (userId: string, criteria: TExerciseCompletion) => {
  const whereExercise: any = {
    completedUsers: { some: { id: userId } },
  };

  if (criteria.requiredRank) {
    whereExercise.completedUsers = {
      ...whereExercise.completedUsers,
      some: { ...whereExercise.completedUsers.some, rank: criteria.requiredRank },
    };
  }

  if (criteria.language) {
    whereExercise.language = criteria.language;
  }

  const completedExercises = await prisma.exercise.findMany({
    where: whereExercise,
  });

  if (criteria.count) {
    const progress = Math.floor((completedExercises.length / criteria.count) * 100);
    return Math.min(progress, 100);
  }

  if (criteria.pointsToComplete) {
    const earnedPoints = completedExercises.reduce((sum, exercise) => (sum += exercise.prizePoints), 0);
    const progress = Math.floor((earnedPoints / criteria.pointsToComplete) * 100);
    return Math.min(progress, 100);
  }
};
