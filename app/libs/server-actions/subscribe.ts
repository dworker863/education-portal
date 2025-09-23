'use server';

import { prisma } from '@/prisma/prisma';
import { getAchievementByCriteriaType, updateAchievementProgress } from './achievements-actions';
import { Prisma } from '@prisma/client';
import { isObjectSubscription } from '../utils/common';
import { TSubscription } from '../interfaces/interfaces';

export const subscribeUser = async (userId: string, amount: number, price: number, tx?: Prisma.TransactionClient) => {
  const client = tx || prisma;
  // const intPrice = Math.ceil(price * 100) / 100;

  // console.log('SubscribeUser function', intPrice);

  try {
    const now = new Date();
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + amount);

    const subscription = {
      type: 'SUBSCRIPTION',
      amount,
      firstTime: true,
      startedAt: now,
      validUntil,
    };

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: {
        subscription,
        moneyUSD: { decrement: price },
      },
    });

    return { updatedUser, success: 'Подписка успешно оформлена' };
  } catch (error) {
    console.error('Ошибка при оформлении подписки:', error);
    throw error;
  }
};

export const extendSubscription = async (
  userId: string,
  amount: number,
  price: number,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx || prisma;

  try {
    const user = await client.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Пользователь не найден');

    if (!user.subscription) throw new Error('У пользователя нет подписки');

    if (isObjectSubscription(user.subscription)) {
      const subscription: TSubscription = user.subscription;

      const validUntil = new Date(user.subscription.validUntil);
      validUntil.setMonth(validUntil.getMonth() + amount);

      const updatedSubscription = {
        ...subscription,
        amount: user.subscription.amount + amount,
        firstTime: false,
        validUntil,
      };

      const updatedUser = await client.user.update({
        where: { id: userId },
        data: {
          subscription: updatedSubscription,
          moneyUSD: { decrement: price },
        },
      });

      return { success: 'Подписка успешно продлена', subscription: updatedUser.subscription };
    }
  } catch (error) {
    console.error('Ошибка при продлении подписки:', error);
    throw error;
  }
};

export const subscribeForOffer = async (userId: string, amount: number, price: number) => {
  console.log('SubscribeForOffer function', price);
  try {
    return await prisma.$transaction(async (tx) => {
      const { updatedUser } = await subscribeUser(userId, amount, price, tx);

      console.log('Achievements for SUBSCRIPTION:', updatedUser);

      const achievements = await getAchievementByCriteriaType('SUBSCRIPTION', tx);

      const achievementProgress = await Promise.all(
        achievements.map((achievement) => {
          return updateAchievementProgress(achievement.id, userId, tx);
        }),
      );

      return { achievementProgress, updatedUser, success: 'Подписка успешно обновлена' };
    });
  } catch (error) {
    console.error('Ошибка при оформлении подписки: ', error);
    throw error;
  }
};
