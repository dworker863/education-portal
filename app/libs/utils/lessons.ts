import { prisma } from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { updateCourseProgress } from '../server-actions/progress-action';
import {
  getAchievementByCriteriaType,
  updateAchievementProgress,
} from '../server-actions/achievements-actions';

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
        createdAt: true,
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

export const getLessonWithExercisesById = async (id: string) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
      },
      include: {
        section: true,
        exercises: true,
        tests: true,
      },
    });

    return lesson;
  } catch (error) {
    console.error('Ошибка при получении урока по ID: ', error);
    throw error;
  }
};

export const checkLessonCompletion = (
  passedExercises: string[],
  totalExercises: string[],
) => {
  const result = (passedExercises.length / totalExercises.length) * 100;

  if (result < 75) {
    return false;
  } else {
    return true;
  }
};
