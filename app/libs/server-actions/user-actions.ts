'use server';

import { prisma } from '@/prisma/prisma';
import { calculateRank } from '../utils/exercises';

export const completeExercise = async (userId: string, exerciseId: string) => {
  console.log('COMPLETE EXERCISE');

  try {
    return await prisma.$transaction(async (prisma) => {
      const existingExercise = await prisma.exercise.findUnique({
        where: {
          id: exerciseId,
        },
        select: { prizePoints: true },
      });

      if (!existingExercise) {
        throw Error('Упражнения с таким ID не существует');
      }

      const existingUser = await prisma.user.findUnique({
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

      const updatedUser = await prisma.user.update({
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
