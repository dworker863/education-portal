import { prisma } from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { updateCourseProgress } from '../server-actions/progress-action';
import { getAchievementByCriteriaType, updateAchievementProgress } from '../server-actions/achievements-actions';

export const getAllLessons = async () => {
  try {
    const lessons = await prisma.lesson.findMany();
    return lessons;
  } catch (error) {
    console.error('Ошибка при получении уроков: ', error);
    throw error;
  }
};

export const getPartialLessons = async () => {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return lessons;
  } catch (error) {
    console.error('Ошибка при получении уроков: ', error);
    throw error;
  }
};

export const getLessonByName = async (name: string) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        name,
      },
      include: {
        exercises: true,
        tests: true,
      },
    });

    return lesson;
  } catch (error) {
    console.error('Ошибка при получении урока по названию: ', error);
    throw error;
  }
};

export const getLessonById = async (id: string) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    return lesson;
  } catch (error) {
    console.error('Ошибка при получении урока по ID: ', error);
    throw error;
  }
};

export const checkLessonCompletion = (passedExercises: string[], totalExercises: string[]) => {
  const result = (passedExercises.length / totalExercises.length) * 100;

  if (result < 75) {
    return false;
  } else {
    return true;
  }
};

export const checkLesson = async (userId: string, courseId: string, lessonId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const courseProgress = await updateCourseProgress(userId, courseId, lessonId, tx);

      const achievements = await getAchievementByCriteriaType('COURSE_COMPLETION', tx);

      const achievementProgress = await Promise.all(
        achievements.map((achievement) => {
          updateAchievementProgress(achievement.id, userId, tx);
        }),
      );

      return { courseProgress, achievementProgress, success: 'Урок успешно проверен' };
    });
  } catch (error) {
    console.error('Ошибка при проверке урока: ', error);
    throw error;
  }
};
