'use server';

import { prisma } from '@/prisma/prisma';
import { getAchievementByCriteriaType, updateAchievementProgress } from './achievements-actions';

export const getUserCoursesProgress = async (userId: string) => {
  try {
    const progress = await prisma.userCourseProgress.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        currentLesson: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(progress);

    return progress;
  } catch (error) {
    console.log('Ошибка при получчении прогресса по курсам');
    throw error;
  }
};

export const getUserAchievementsProgress = async (userId: string) => {
  try {
    const progress = await prisma.userAchievementProgress.findMany({
      where: {
        userId,
      },
      include: {
        achievement: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(progress);

    return progress;
  } catch (error) {
    console.log('Ошибка при получении прогресса по достижениям');
    throw error;
  }
};

export const createCourseProgress = async (userId: string, courseId: string) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: courseId }, include: { lessons: true } });

    if (!course) throw new Error('Курса с таким ID не существует');

    if (!course.lessons || course.lessons.length === 0) {
      throw new Error('У данного курса нет уроков');
    }

    const progress = await prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      create: {
        userId,
        courseId,
        progress: 0,
        currentLessonId: course.lessons[0].id,
      },
      update: {},
    });

    return progress;
  } catch (error) {
    console.error('Ошибка при создании прогресса по курсу:', error);
    throw error;
  }
};

export const updateCourseProgress = async (userId: string, courseId: string, lessonId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const lessonExists = await tx.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true },
      });

      if (!lessonExists) throw new Error('Урок не найден');

      const alreadyCompleted = await tx.userCourseProgress.findFirst({
        where: {
          userId,
          courseId,
          completedLessons: { some: { id: lessonId } },
        },
      });

      if (alreadyCompleted) return;

      const totalLessonsCount = await tx.lesson.count({
        where: { courseId },
      });

      const completedLessonsCount = await tx.lesson.count({
        where: {
          courseId,
          completedByUsers: { some: { userId } },
        },
      });

      const updatedProgress = Math.round(((completedLessonsCount + 1) / totalLessonsCount) * 100);

      const progress = await tx.userCourseProgress.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        create: {
          userId,
          courseId,
          currentLessonId: lessonId,
          progress: updatedProgress,
          completedLessons: { connect: { id: lessonId } },
          completedAt: updatedProgress >= 100 ? new Date() : undefined,
        },
        update: {
          currentLessonId: lessonId,
          progress: updatedProgress,
          completedLessons: { connect: { id: lessonId } },
          completedAt: updatedProgress >= 100 ? new Date() : undefined,
          lastAccessedAt: new Date(),
        },
      });

      return { progress, sucess: 'Прогресс успешно обновлен' };
    });
  } catch (error) {
    console.error('Ошибка при обновлении прогресса по курсу:', error);
    throw error;
  }
};

export const courseRegistrationHandler = async (userId: string, courseId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const courseProgress = await createCourseProgress(userId, courseId);

      const achievements = await getAchievementByCriteriaType(['COURSE_REGISTRATION', 'COMBINATION']);

      const progress = await Promise.all(
        achievements.map((achievement) => {
          updateAchievementProgress(achievement.id, userId);
        }),
      );

      return { progress, sucess: 'Прогресс успешно обновлен' };
    });
  } catch (error) {
    console.log('Ошибка при регистрации на курсе: ', error);
    throw error;
  }
};
