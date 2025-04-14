import { prisma } from '@/prisma/prisma';

export const getCourseByName = async (name: string) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        name,
      },
      include: {
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
