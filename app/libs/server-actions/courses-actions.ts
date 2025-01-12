'use server';

import { prisma } from '@/prisma/prisma';
import { getCourseById } from '../utils/courses';

export const deleteCourse = async (id: string) => {
  try {
    const course = await getCourseById(id);

    if (!course) throw new Error('Курса с таким ID не существует');

    await prisma.course.delete({
      where: {
        id,
      },
    });

    return { success: 'Курс успешно удален' };
  } catch (error) {
    console.error('Ошибка при удалении курса: ', error);
    throw error;
  }
};
