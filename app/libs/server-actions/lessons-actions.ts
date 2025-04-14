'use server';

import { prisma } from '@/prisma/prisma';
import { getLessonById } from '../utils/lessons';

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
