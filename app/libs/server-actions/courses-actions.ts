'use server';

import { prisma } from '@/prisma/prisma';
import { courseSchema } from '../validation';
import { z } from 'zod';
import { getCourseById } from '../utils/courses';

export const addCourse = async (values: z.infer<typeof courseSchema>) => {
  const { data, ...parsedValues } = await courseSchema.safeParse(values);

  if (!parsedValues.success) {
    throw new Error(parsedValues.error?.issues[0].message);
  }

  if (!data) {
    throw new Error('Invalid data');
  }

  try {
    await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        icon: '',
        usersIds: [],
        priceUSD: Number(data.priceUSD),
        certificateId: 'test',
        completedUsersCount: 0,
        category: data.category,
      },
    });

    return { success: 'Course successfully added' };
  } catch (error) {
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const course = await getCourseById(id);

    if (!course) throw new Error('Course does not exists');

    await prisma.course.delete({
      where: {
        id,
      },
    });

    return { success: 'Course successfully deleted' };
  } catch (error) {
    throw error;
  }
};
