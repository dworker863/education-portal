import { prisma } from '@/prisma/prisma';

export const getAchievementByName = async (name: string) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: {
        name,
      },
      include: {
        course: {
          select: { name: true },
        },
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
