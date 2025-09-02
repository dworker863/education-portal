'use server';

import { prisma } from '@/prisma/prisma';
import { getUserById } from '../utils/auth';

export const updateUserMoney = async (userId: string, amount: number) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('Пользователь не найден');

    user.moneyUSD -= amount;

    await prisma.user.update({
      where: { id: userId },
      data: { moneyUSD: user.moneyUSD },
    });

    return { success: 'Баланс успешно обновлён' };
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};
