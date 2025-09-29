'use server';

import { prisma } from '@/prisma/prisma';
import { getAchievementByCriteriaType, updateAchievementProgress } from './achievements-actions';
import { Prisma } from '@prisma/client';
import { isObjectSubscription } from '../utils/common';
import { TSubscription } from '../interfaces/interfaces';

export const subscribeUser = async (userId: string, amount: number, price: number, tx?: Prisma.TransactionClient) => {
  const client = tx || prisma;

  try {
    const user = await client.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Пользователь не найден');

    let updatedSubscription;

    if (user.subscription && isObjectSubscription(user.subscription)) {
      const userSubscription: TSubscription = user.subscription;

      const validUntil = new Date(user.subscription.validUntil);
      validUntil.setMonth(validUntil.getMonth() + amount);

      updatedSubscription = {
        ...userSubscription,
        amount: user.subscription.amount + amount,
        firstTime: false,
        validUntil,
      };
    }

    if (!user.subscription) {
      const now = new Date();
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + amount);

      updatedSubscription = {
        type: 'SUBSCRIPTION',
        amount,
        firstTime: true,
        startedAt: now,
        validUntil,
      };
    }

    const isFirstPurchase = !user.hasFirstPurchase;

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: {
        subscription: updatedSubscription,
        moneyUSD: { decrement: price },
        hasFirstPurchase: true,
      },
    });

    if (isFirstPurchase && user.referredById) {
      const referralsWithPurchase = await client.user.count({
        where: {
          referredById: user.referredById,
          hasFirstPurchase: true,
        },
      });

      // если число рефералов стало кратно 10 → даём новый билет
      if (referralsWithPurchase % 10 === 0) {
        await client.user.update({
          where: { id: user.referredById },
          data: {
            prizeTickets: {
              connect: { name: 'Награда за рефералов ' }, // id уже существующего билета
            },
          },
        });
      }
    }

    return { updatedUser, success: 'Подписка успешно оформлена' };
  } catch (error) {
    console.error('Ошибка при оформлении подписки:', error);
    throw error;
  }
};

export const subscribeForOffer = async (userId: string, amount: number, price: number) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { updatedUser } = await subscribeUser(userId, amount, price, tx);

      const achievements = await getAchievementByCriteriaType('SUBSCRIPTION', tx);

      const achievementProgress = await Promise.all(
        achievements.map((achievement) => {
          return updateAchievementProgress(achievement.id, userId, tx, amount);
        }),
      );

      return { achievementProgress, updatedUser, success: 'Подписка успешно обновлена' };
    });
  } catch (error) {
    console.error('Ошибка при оформлении подписки: ', error);
    throw error;
  }
};
