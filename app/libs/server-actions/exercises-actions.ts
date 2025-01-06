'use server';

import { createExerciseSchema, editExerciseSchema } from '../validation';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { getExerciseById } from '../utils/exercises';

export const addExercise = async (
  values: z.infer<typeof createExerciseSchema>,
) => {
  try {
    const { data, ...parsedValues } = await createExerciseSchema.safeParse(
      values,
    );

    if (!parsedValues.success) {
      throw new Error(parsedValues.error?.issues[0].message);
    }

    if (!data) {
      throw new Error('Invalid data');
    }

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

    return { success: 'Упражнение успешно добавлено' };
  } catch (error) {
    throw error;
  }
};

export const editExercise = async (
  id: string,
  values: z.infer<typeof editExerciseSchema>,
) => {
  try {
    const existingExercise = await getExerciseById(id);

    if (!existingExercise) {
      throw new Error('Упражнения с таким ID не существует');
    }

    const { data, ...parsedValues } = await editExerciseSchema.safeParse(
      values,
    );

    if (!parsedValues.success) {
      throw new Error(parsedValues.error?.issues[0].message);
    }

    if (!data) {
      throw new Error('Invalid data');
    }

    const updatedData = {
      name: data.name || existingExercise.name,
      task: data.task || existingExercise.task,
      code: data.code || existingExercise.code,
      test: data.test || existingExercise.test,
      solution: data.solution || existingExercise.solution,
      requiredRank: data.requiredRank || 'D-',
      prizePoints: Number(data.prizePoints),
      lessonId: data.lessonId || existingExercise.lessonId,
    };

    await prisma.exercise.update({
      where: {
        id,
      },
      data: updatedData,
    });

    return { success: 'Упражнение успешно изменено' };
  } catch (error) {
    throw error;
  }
};

export const deleteLesson = async (id: string) => {
  try {
    const lesson = await getExerciseById(id);

    if (!lesson) throw new Error('Упражнения с таким ID не существует');

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
