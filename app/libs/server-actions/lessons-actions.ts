'use server';

import { prisma } from '@/prisma/prisma';
import { getLessonById } from '../utils/lessons';

export const deleteLesson = async (id: string) => {
  try {
    const lesson = await getLessonById(id);

    if (!lesson) throw new Error('Course does not exists');

    await prisma.lesson.delete({
      where: {
        id,
      },
    });

    return { success: 'Course successfully deleted' };
  } catch (error) {
    throw error;
  }
};
