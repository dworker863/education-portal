import { prisma } from '@/prisma/prisma';
import { cache } from 'react';

export const getAllCourses = cache(async () => {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    console.error('Ошибка при получении курсов: ', error);
    throw error;
  }
});

export const getCourseByName = async (name: string) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        name,
      },
      select: {
        name: true,
        id: true,
        lessons: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return course;
  } catch (error) {
    console.error('Ошибка при получении курса по названию: ', error);
    throw error;
  }
};

export const getCourseById = async (id: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    return course;
  } catch (error) {
    console.error('Ошибка при получении курса по ID: ', error);
    throw error;
  }
};

export const getCourseWithLessonsById = async (id: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        lessons: {
          orderBy: {
            createdAt: 'asc', // или 'desc'
          },
        },
      },
    });

    return course;
  } catch (error) {
    console.error('Ошибка при получении курса по ID: ', error);
    throw error;
  }
};
