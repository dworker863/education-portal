'use server';

import { prisma } from '@/prisma/prisma';
import { calculateRank } from '../utils/exercises';

export const completeExercise = async (userId: string, exerciseId: string) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const existingExercise = await prisma.exercise.findUnique({
        where: {
          id: exerciseId,
        },
        select: { prizePoints: true },
      });

      if (!existingExercise) {
        return { error: 'Упражнения с таким ID не существует' };
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
        return { error: 'Пользователя с таким ID не существует' };
      }

      const newRating =
        existingUser.completedExercises.length > 0
          ? existingUser.rating
          : existingUser.rating + existingExercise.prizePoints;
      const newRank = calculateRank(newRating);

      await prisma.user.update({
        where: { id: userId },
        data: {
          completedExercises: {
            connect: {
              id: exerciseId,
              NOT: {
                completedUsers: { some: { id: userId } },
              },
            },
          },
        },
      });

      return { success: 'Рейтинг успешно обновлен' };
    });
  } catch (error) {
    console.error('Ошибка при обновлении рейтинга пользователя: ', error);
    throw error;
  }
};
