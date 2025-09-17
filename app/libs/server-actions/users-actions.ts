'use server';

import { prisma } from '@/prisma/prisma';
import { getUserById } from '../utils/auth';
import { TSubscription } from '../interfaces/interfaces';
import { isObjectSubscription } from '../utils/common';

export const updateUserMoney = async (userId: string, amount: number) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('Пользователь не найден');

    user.moneyUSD -= amount;

    await prisma.user.update({
      where: { id: userId },
      data: { moneyUSD: user.moneyUSD },
    });

    return { success: 'Баланс успешно обновлён', moneyUSD: user.moneyUSD };
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};

export const subscribeUser = async (userId: string, tier: 'PRO' | 'PREMIUM', months: number, amount: number) => {
  try {
    const now = new Date();
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + months);

    const subscription = {
      type: 'SUBSCRIPTION',
      tier,
      amount,
      firstTime: true,
      startedAt: now,
      validUntil,
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription,
      },
    });

    return { success: 'Подписка успешно оформлена', subscription: updatedUser.subscription };
  } catch (error) {
    console.error('Ошибка при оформлении подписки:', error);
    throw error;
  }
};

export const extendSubscription = async (userId: string, months: number, amount: number) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Пользователь не найден');

    if (!user.subscription) throw new Error('У пользователя нет подписки');

    if (isObjectSubscription(user.subscription)) {
      const subscription: TSubscription = user.subscription;

      const validUntil = new Date(user.subscription.validUntil);
      validUntil.setMonth(validUntil.getMonth() + months);

      const updatedSubscription = {
        ...subscription,
        amount: user.subscription.amount + amount,
        firstTime: false,
        validUntil,
      };

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          subscription: updatedSubscription as any,
        },
      });

      return { success: 'Подписка успешно продлена', subscription: updatedUser.subscription };
    }
  } catch (error) {
    console.error('Ошибка при продлении подписки:', error);
    throw error;
  }
};
