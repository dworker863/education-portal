import { prisma } from '@/prisma/prisma';

export const getAchievementByName = async (name: string) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: {
        name,
      },
    });

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении достижения по названию: ', error);
    throw error;
  }
};

export const getAchievementById = async (id: string) => {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: {
        id,
      },
    });

    if (!achievement) throw new Error('Достижения с таким ID не существует');

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении достижения по ID: ', error);
    throw error;
  }
};
