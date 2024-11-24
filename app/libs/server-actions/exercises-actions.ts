'use server';

import { exerciseSchema } from '../validation';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma';

export const addExercise = async (values: z.infer<typeof exerciseSchema>) => {
  const { data, ...parsedValues } = await exerciseSchema.safeParse(values);

  if (!parsedValues.success) {
    throw new Error(parsedValues.error?.issues[0].message);
  }

  if (!data) {
    throw new Error('Invalid data');
  }

  try {
    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        lessonId: data.lessonId,
        task: data.task,
        code: data.code || null,
        test: data.test,
        solution: data.solution,
        requiredRank: data.requiredRank || 'D-',
        prizePoints: Number(data.prizePoints),
      },
    });

    if (data.lessonId) {
      await prisma.lesson.update({
        where: {
          id: data.lessonId,
        },
        data: {
          exerciseId: exercise.id,
        },
      });
    }

    return { success: 'Exercise successfully added' };
  } catch (error) {
    throw error;
  }
};
