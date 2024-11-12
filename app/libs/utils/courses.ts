import { prisma } from '@/prisma/prisma';

export const getAllCourses = async () => {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    throw error;
  }
};

export const getCourseByName = async (name: string) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        name,
      },
    });

    return course;
  } catch (error) {
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
    throw error;
  }
};
