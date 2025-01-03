'use server';

import { prisma } from '@/prisma/prisma';
import { getLessonById } from '../utils/lessons';

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
    throw error;
  }
};
