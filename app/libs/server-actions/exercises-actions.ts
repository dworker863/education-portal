'use server';

import { createExerciseSchema, editExerciseSchema } from '../validation';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { getExerciseById, getExerciseByName } from '../utils/exercises';
import { calculateRank } from '../utils/common';
import { cache } from 'react';

export const getAllExercises = cache(async () => {
  try {
    const exercises = await prisma.exercise.findMany();
    return exercises;
  } catch (error) {
    console.error('Ошибка при получении упражнений: ', error);
    throw error;
  }
});

export const addExercise = async (values: z.infer<typeof createExerciseSchema>) => {
  try {
    const { data, ...parsedResult } = await createExerciseSchema.safeParse(values);

    const existingExercise = await getExerciseByName(values.name);

    if (existingExercise && existingExercise.language === data?.language) {
      throw new Error('Упражнение с таким названием уже существует');
    }

    if (!parsedResult.success) {
      throw new Error(parsedResult.error?.issues[0].message);
    }

    if (!data) {
      throw new Error('Invalid data');
    }

    await prisma.exercise.create({
      data: {
        name: data.name,
        task: data.task,
        code: data.code || null,
        test: data.test,
        solution: data.solution,
        language: data.language,
        requiredRank: data.requiredRank || 'D-',
        prizePoints: data.prizePoints,
        lessonId: data.lessonId || null,
      },
    });

    return { success: 'Упражнение успешно добавлено' };
  } catch (error) {
    console.error('Ошибка при создании упражнения: ', error);
    throw error;
  }
};

export const editExercise = async (id: string, values: z.infer<typeof editExerciseSchema>) => {
  try {
    if (!id) {
      throw new Error('Не указан ID упражнения');
    }

    const existingExercise = await getExerciseById(id);

    if (!existingExercise) {
      throw new Error('Упражнение не найдено');
    }

    const { data, ...parsedResult } = await editExerciseSchema.safeParse(values);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error?.issues[0].message);
    }

    if (!data) {
      throw new Error('Invalid data');
    }

    const fieldsToCheck = [
      'name',
      'task',
      'code',
      'test',
      'solution',
      'language',
      'requiredRank',
      'prizePoints',
      'lessonId',
    ] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingExercise[field]) {
        updatedData[field] = field === 'prizePoints' ? Number(data[field]) : data[field];
      }
    });

    if (updatedData.name) {
      const exercise = await getExerciseByName(updatedData.name);

      if (exercise && exercise.language === data?.language && id !== exercise.id) {
        throw Error('Упражнение с таким названием уже существует');
      }
    }

    await prisma.exercise.update({
      where: {
        id,
      },
      data: updatedData,
    });

    return { success: 'Упражнение успешно изменено' };
  } catch (error) {
    console.error('Ошибка при обновлении упражнения: ', error);
    throw error;
  }
};

export const deleteExercise = async (id: string) => {
  try {
    const exercise = await getExerciseById(id);

    if (!exercise) throw new Error('Упражнения с таким ID не существует');

    await prisma.exercise.delete({
      where: {
        id,
      },
    });

    return { success: 'Упражнение успешно удалено' };
  } catch (error) {
    console.error('Ошибка при удалении упражнения: ', error);
    throw error;
  }
};

export const completeExercise = async (userId: string, exerciseId: string) => {
  console.log('COMPLETE EXERCISE');

  try {
    return await prisma.$transaction(async (tx) => {
      const existingExercise = await tx.exercise.findUnique({
        where: {
          id: exerciseId,
        },
        select: { prizePoints: true },
      });

      if (!existingExercise) {
        throw Error('Упражнения с таким ID не существует');
      }

      const existingUser = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          rating: true,
          completedExercises: {
            where: {
              id: exerciseId,
            },
          },
        },
      });

      if (!existingUser) {
        throw Error('Пользователя с таким ID не существует');
      }

      const newRating =
        existingUser.completedExercises.length > 0
          ? existingUser.rating
          : existingUser.rating + existingExercise.prizePoints;

      const newRank = calculateRank(newRating);

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          rating: newRating,
          rank: newRank,
          completedExercises: {
            connect: {
              id: exerciseId,
            },
          },
        },
      });

      return { user: updatedUser, success: 'Рейтинг успешно обновлен' };
    });
  } catch (error) {
    console.error('Ошибка при обновлении рейтинга пользователя: ', error);
    throw error;
  }
};
