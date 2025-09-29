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

    const isFirstPurchase = !user.hasFirstPurchase;

    await client.user.update({
      where: { id: userId },
      data: {
        moneyUSD: user.moneyUSD,
        hasFirstPurchase: true,
      },
    });

    // 🔥 Логика начисления бонусов за рефералов
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

    return { success: 'Баланс успешно обновлён', moneyUSD: user.moneyUSD };
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};
