'use server';

import { prisma } from '@/prisma/prisma';
import { TCriteria, TCriteriaType } from '../interfaces/interfaces';
import { criteriaSchema } from '../validation';
import { getNewProgress } from '../utils/progress';
import { getAchievementById } from '../utils/achievements';
import { cache } from 'react';

export const getAllAchievements = cache(async () => {
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
});

export const deleteAchievement = async (id: string) => {
  try {
    const achivement = await getAchievementById(id);

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

export const getAchievementByCriteriaType = async (criteriaTypes: TCriteriaType[]) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        criteriaType: { in: criteriaTypes },
      },
      select: {
        id: true,
        criteriaType: true,
        criteria: true,
      },
    });

    // const combinationResult = achievements.filter((achievement) => {
    //   if (achievement.criteriaType === criteriaTypes[0]) {
    //     return true;
    //   }

    //   if (achievement.criteria && typeof achievement.criteria === 'object' && !Array.isArray(achievement.criteria)) {
    //     if (
    //       achievement.criteriaType === 'COMBINATION' &&
    //       achievement.criteria.conditions &&
    //       Array.isArray(achievement.criteria.conditions)
    //     ) {
    //       return achievement.criteria.conditions.some(
    //         (condition) =>
    //           condition &&
    //           typeof condition === 'object' &&
    //           !Array.isArray(condition) &&
    //           condition.type === criteriaTypes[0],
    //       );
    //     }
    //   }
    // });

    console.log('ACHIEVEMENT BY CRITERIA TYPE: ', achievements);

    return achievements;
  } catch (error) {
    console.error('Ошибка при получении достижения по типу критерия: ', error);
    throw error;
  }
};

export const updateAchievementProgress = async (achievementId: string, userId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const achievement = await tx.achievement.findUnique({
        where: {
          id: achievementId,
        },
        select: {
          startDate: true,
          endDate: true,
          criteria: true,
        },
      });

      if (!achievement) {
        throw new Error('Достижения с таким ID не существует');
      }

      const now = new Date();
      if (achievement.startDate > now) return;
      if (achievement.endDate && achievement.endDate < now) return;

      let userProgress = await tx.userAchievementProgress.findUnique({
        where: { userId_achievementId: { userId, achievementId } },
        select: {
          id: true,
          completedAt: true,
          progress: true,
        },
      });

      if (userProgress?.completedAt) {
        throw new Error('Достижение было выполнено ранее');
      }

      if (!userProgress) {
        userProgress = await tx.userAchievementProgress.create({
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

      const progress = await tx.userAchievementProgress.update({
        where: {
          id: userProgress.id,
        },
        data: {
          progress: newProgress,
          ...(isNowComplete && { completedAt: new Date() }),
        },
      });

      return { progress, success: 'Прогресс успешно обновлен' };
    });
  } catch (error) {
    console.error('Ошибка при обновлении прогресса достижения: ', error);
    throw error;
  }
};
