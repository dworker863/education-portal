'use server';

import { prisma } from '@/prisma/prisma';
import { getCourseById } from '../utils/courses';

export const getAllCourses = async () => {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    console.error('Ошибка при получении курсов: ', error);
    throw error;
  }
};

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

export const getCoursesNames = async () => {
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
