import { prisma } from '@/prisma/prisma';
import { getCourseById } from './courses';
import { getExerciseById } from './exercises';

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

export const getInvalidIds = async (type: 'courses' | 'exercises', ids: string[]) => {
  const idsCheckPromises = ids.map(async (id) => {
    const entity = type === 'courses' ? await getCourseById(id) : await getExerciseById(id);
    return { id, exists: !!entity };
  });

  const results = await Promise.all(idsCheckPromises);

  return results.filter((result) => !result.exists).map((result) => result.id);
};
