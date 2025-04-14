'use server';

import { prisma } from '@/prisma/prisma';

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
    console.log(error);
  }
};

export const updateCourseProgress = async (userId: string, courseId: string, lessonId: string) => {
  try {
    const result = await prisma.$transaction(
      async () => {
        const lessonExists = await prisma.lesson.findUnique({
          where: { id: lessonId },
          select: { id: true },
        });

        if (!lessonExists) throw new Error('Урок не найден');

        const alreadyCompleted = await prisma.userCourseProgress.findFirst({
          where: {
            userId,
            courseId,
            completedLessons: { some: { id: lessonId } },
          },
        });

        if (alreadyCompleted) return { warning: 'Урок уже был завершен ранее' };

        const totalLessonsCount = await prisma.lesson.count({
          where: { courseId },
        });

        const completedLessonsCount = await prisma.lesson.count({
          where: {
            courseId,
            completedByUsers: { some: { userId } },
          },
        });

        const updatedProgress = Math.round((completedLessonsCount + 1 / totalLessonsCount) * 100);

        await prisma.userCourseProgress.upsert({
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
      },
      { maxWait: 5000, timeout: 10000 },
    );

    return { sucess: 'Прогресс успешно обновлен', result };
  } catch (error) {
    console.error('Ошибка обновления прогресса:', error);
    throw new Error('Не удалось обновить прогресс');
  }
};
