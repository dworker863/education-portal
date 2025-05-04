'use server';

import { prisma } from '@/prisma/prisma';

export const getAllAchievements = async () => {
  try {
    const achievement = await prisma.achievement.findMany({
      include: {
        usersProgress: true,
      },
    });

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении достижений: ', error);
    throw error;
  }
};

export const deleteAchievement = async (id: string) => {
  try {
    const achivement = await prisma.achievement.findUnique({
      where: {
        id,
      },
    });

    if (!achivement) throw new Error('Достижения с таким ID не существует');

    await prisma.achievement.delete({
      where: {
        id,
      },
    });

    return { success: 'Достижение успешно удалено' };
  } catch (error) {
    console.error('Ошибка при удалении достижения: ', error);
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
