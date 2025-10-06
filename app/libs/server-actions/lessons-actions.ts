'use server';

import { prisma } from '@/prisma/prisma';
import { getLessonById } from '../utils/lessons';
import { updateCourseProgress } from './progress-action';
import { getAchievementByCriteriaType, updateAchievementProgress } from './achievements-actions';

export const deleteLesson = async (id: string) => {
  try {
    const lesson = await getLessonById(id);

    if (!lesson) throw new Error('Урока с таким ID не существует');

    await prisma.lesson.delete({
      where: {
        id,
      },
    });

    return { success: 'Урок успешно удален' };
  } catch (error) {
    console.error('Ошибка при удалении урока: ', error);
    throw error;
  }
};

export const checkLesson = async (userId: string, courseId: string, lessonId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const courseProgress = await updateCourseProgress(userId, courseId, lessonId, tx);

      const achievements = await getAchievementByCriteriaType('COURSE_COMPLETION', tx);

      const achievementProgress = await Promise.all(
        achievements.map((achievement) => {
          return updateAchievementProgress(achievement.id, userId, tx);
        }),
      );

      return { achievementProgress, courseProgress, success: 'Урок успешно проверен' };
    });
  } catch (error) {
    console.error('Ошибка при проверке урока: ', error);
    throw error;
  }
};
