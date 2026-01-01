'use server';

import { prisma } from '@/prisma/prisma';

export const getSectionByNameAndCourseId = async (
  name: string,
  courseId: string,
) => {
  try {
    const section = await prisma.courseSection.findFirst({
      where: {
        title: name,
        courseId,
      },
      select: {
        id: true,
        title: true,
      },
    });
    console.log('getSectionByNameAndCourseId called with:', section);
    return section;
  } catch (error) {
    console.error('Ошибка при получении раздела:', error);
    throw error;
  }
};
