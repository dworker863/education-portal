'use server';

import { prisma } from '@/prisma/prisma';
import { getUserById } from '../utils/auth';
import { Prisma } from '@prisma/client';

export const updateUserMoney = async (userId: string, amount: number, tx?: Prisma.TransactionClient) => {
  const client = tx || prisma;

  try {
    const user = await getUserById(userId, client);
    if (!user) throw new Error('Пользователь не найден');

    user.moneyUSD -= amount;

    await client.user.update({
      where: { id: userId },
      data: { moneyUSD: user.moneyUSD },
    });

    return { success: 'Баланс успешно обновлён', moneyUSD: user.moneyUSD };
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};
