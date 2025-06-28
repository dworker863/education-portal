'use server';

import { prisma } from '@/prisma/prisma';
import { TCriteria, TCriteriaType } from '../interfaces/interfaces';
import { criteriaSchema } from '../validation';
import { getNewProgress } from '../utils/achievements';

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

export const getAchievementByCriteriaType = async (criteriaTypes: TCriteriaType[]) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        criteriaType: { in: criteriaTypes },
      },
    });

    const combinationResult = achievements.filter((achievement) => {
      if (achievement.criteriaType === criteriaTypes[0]) {
        return true;
      }

      if (achievement.criteria && typeof achievement.criteria === 'object' && !Array.isArray(achievement.criteria)) {
        if (
          achievement.criteriaType === 'COMBINATION' &&
          achievement.criteria.conditions &&
          Array.isArray(achievement.criteria.conditions)
        ) {
          return achievement.criteria.conditions.some(
            (condition) =>
              condition &&
              typeof condition === 'object' &&
              !Array.isArray(condition) &&
              condition.type === criteriaTypes[0],
          );
        }
      }
    });

    console.log('ACHIEVEMENT BY CRITERIA TYPE: ', achievements);

    return achievements;
  } catch (error) {
    console.error('Ошибка при получении достижения по тпу критерия: ', error);
    throw error;
  }
};

export const updateAchievementProgress = async (achievementId: string, userId: string) => {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });

    if (!achievement) {
      throw new Error('Достижения с таким ID не существует');
    }

    const now = new Date();
    if (achievement.startDate > now) return;
    if (achievement.endDate && achievement.endDate < now) return;

    let userProgress = await prisma.userAchievementProgress.findUnique({
      where: { userId_achievementId: { userId, achievementId } },
    });

    if (userProgress?.completedAt) {
      throw new Error('Достижение было выполнено ранее');
    }

    if (!userProgress) {
      userProgress = await prisma.userAchievementProgress.create({
        data: {
          userId,
          achievementId,
          progress: 0,
          stepsCompleted: {},
        },
      });
    }

    let newProgress = 0;

    if (achievement.criteria && typeof achievement.criteria === 'object' && !Array.isArray(achievement.criteria)) {
      const criteria = criteriaSchema.parse(achievement.criteria) as TCriteria;
      newProgress = await getNewProgress(userId, criteria);
    }

    console.log('NEW PROGRESS: ', newProgress);

    const isNowComplete = newProgress >= 100 && userProgress.progress < 100;

    await prisma.userAchievementProgress.update({
      where: {
        id: userProgress.id,
      },
      data: {
        progress: newProgress,
        ...(isNowComplete && { completedAt: new Date() }),
      },
    });
  } catch (error) {
    console.error('Ошибка при получении достижения по ID: ', error);
  }
};
