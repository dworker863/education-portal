'use server';

import { prisma } from '@/prisma/prisma';

export const getAllAchievements = async () => {
  try {
    const achievement = await prisma.achievement.findMany();

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

    if (!achivement) throw new Error('Курса с таким ID не существует');

    await prisma.achievement.delete({
      where: {
        id,
      },
    });

    return { success: 'Курс успешно удален' };
  } catch (error) {
    console.error('Ошибка при удалении курса: ', error);
    throw error;
  }
};
