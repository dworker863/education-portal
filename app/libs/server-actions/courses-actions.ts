'use server';

import { prisma } from '@/prisma/prisma';
import { getCourseById } from '../utils/courses';
import { createCourseProgress } from './progress-action';
import {
  getAchievementByCriteriaType,
  updateAchievementProgress,
} from './achievements-actions';
import { ICourse } from '../interfaces/interfaces';
import { updateUserMoney } from './users-actions';
import { deleteIndexCourse } from '../search-engine/collections';

export const deleteCourse = async (id: string) => {
  try {
    const course = await getCourseById(id);

    if (!course) throw new Error('Курса с таким ID не существует');

    await prisma.course.delete({
      where: {
        id,
      },
    });

    await deleteIndexCourse(course.id);

    return { success: 'Курс успешно удален' };
  } catch (error) {
    console.error('Ошибка при удалении курса: ', error);
    throw error;
  }
};

export const getCourseNames = async () => {
  try {
    const coursesNames = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return coursesNames;
  } catch (error) {
    console.error('Ошибка при получении имен курсов: ', error);
    throw error;
  }
};

export const registerForCourse = async (
  userId: string,
  course: ICourse,
  priceWithDiscount?: number,
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const courseProgress = await createCourseProgress(userId, course.id, tx);

      const achievements = await getAchievementByCriteriaType(
        'COURSE_REGISTRATION',
        tx,
      );

      const achievementProgress = await Promise.all(
        achievements.map((achievement) => {
          return updateAchievementProgress(achievement.id, userId, tx);
        }),
      );

      const price = priceWithDiscount ?? course.priceUSD;

      const { moneyUSD } = await updateUserMoney(userId, price, tx);

      return {
        achievementProgress,
        courseProgress,
        moneyUSD,
        success: 'Прогресс успешно обновлен',
      };
    });
  } catch (error) {
    console.error('Ошибка при регистрации на курсе: ', error);
    throw error;
  }
};
