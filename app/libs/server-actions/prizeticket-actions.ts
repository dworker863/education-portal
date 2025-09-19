'use server';

import { prisma } from '@/prisma/prisma';
import { z } from 'zod';
import { createPrizeTicketSchema, editPrizeTicketSchema } from '../validation';
import { disconnectPrizeTicketFromUser, getPrizeTicketByCode, getPrizeTicketById } from '../utils/prizetickets';
import { cache } from 'react';
import { getUserById } from '../utils/auth';
import { extendSubscription, subscribeUser } from './users-actions';

export const getAllPrizeTickets = cache(async () => {
  try {
    const prizeTickets = await prisma.prizeTicket.findMany();
    return prizeTickets;
  } catch (error) {
    console.error('Ошибка при получении призовых билетов: ', error);
    throw error;
  }
});

export const addPrizeTicket = async (values: z.infer<typeof createPrizeTicketSchema>) => {
  try {
    const { data, ...parsedResult } = await createPrizeTicketSchema.safeParse(values);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error?.issues[0].message);
    }

    if (!data) throw new Error('Invalid data');

    const existingTicket = await getPrizeTicketByCode(data.code);

    if (existingTicket) {
      throw new Error('Призовой билет с таким кодом уже существует');
    }

    if (data.type === 'DISCOUNT' && (data.percent === null || data.percent === undefined)) {
      throw new Error('Для DISCOUNT нужно указать percent');
    }

    if (data.type === 'SUBSCRIPTION' && (data.months === null || data.months === undefined)) {
      throw new Error('Для SUBSCRIPTION нужно указать months');
    }

    if (
      typeof data.minAmountToActivate === 'number' &&
      typeof data.maxAmountToActivate === 'number' &&
      data.maxAmountToActivate > 0 &&
      data.maxAmountToActivate < data.minAmountToActivate
    ) {
      throw new Error('maxAmountToActivate не может быть меньше minAmountToActivate');
    }

    await prisma.prizeTicket.create({
      data: {
        type: data.type,
        code: data.code,
        name: data.name || null,
        percent: data.percent || null,
        months: data.months || null,
        minAmountToActivate: data.minAmountToActivate || 0,
        maxAmountToActivate: data.maxAmountToActivate || 0,
        validFrom: data.validFrom || new Date(),
        validUntil: data.validUntil || null,
      },
    });

    return { success: 'Призовой билет успешно добавлен' };
  } catch (error) {
    console.error('Ошибка при создании призового билета : ', error);
    throw error;
  }
};

export const editPrizeTicket = async (id: string, values: z.infer<typeof editPrizeTicketSchema>) => {
  try {
    if (!id) throw new Error('Не указан ID призового билета');

    const existingTicket = await getPrizeTicketById(id);
    if (!existingTicket) throw new Error('Призовой билет не найден');

    const { data, ...parsedResult } = await editPrizeTicketSchema.safeParse(values);

    if (!parsedResult.success) throw new Error(parsedResult.error.issues[0].message);

    if (!data) throw new Error('Invalid data');

    const fieldsToCheck = [
      'type',
      'code',
      'name',
      'percent',
      'months',
      'minAmountToActivate',
      'maxAmountToActivate',
      'validFrom',
      'validUntil',
    ] as const;

    const updatedData: Record<string, any> = {};

    if (data.code && data.code !== existingTicket.code) {
      const byCode = await prisma.prizeTicket.findUnique({ where: { code: data.code } });
      if (byCode) throw new Error('Купон с таким кодом уже существует');
      updatedData.code = data.code;
    }

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingTicket[field]) {
        updatedData[field] = data[field];
      }
    });

    await prisma.prizeTicket.update({
      where: {
        id,
      },
      data: updatedData,
    });

    return { success: 'Призовой билет успешно изменён' };
  } catch (error) {
    console.error('Ошибка при обновлении призового билета: ', error);
    throw error;
  }
};

export const deletePrizeTicket = async (id: string) => {
  try {
    const existing = await getPrizeTicketById(id);
    if (!existing) throw new Error('Призовой билет не найден');

    await prisma.prizeTicket.delete({ where: { id } });

    return { success: 'Призовой билет успешно удалён' };
  } catch (error) {
    console.error('Ошибка при удалении призового билета: ', error);
    throw error;
  }
};

export const applyPrizeTicket = async (userId: string, prizeTicketId: string, type: 'DISCOUNT' | 'SUBSCRIPTION') => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingTicket = await getPrizeTicketById(prizeTicketId, tx);

      if (!existingTicket) throw new Error('Призовой билет не найден');

      const existingUser = await getUserById(userId, tx);

      if (!existingUser) throw new Error('Пользователь не найден');

      if (type === 'SUBSCRIPTION' && existingTicket.type !== 'SUBSCRIPTION')
        throw new Error('Призовой билет не является подпиской');

      if (type === 'DISCOUNT' && existingTicket.type !== 'DISCOUNT')
        throw new Error('Призовой билет не является скидкой');

      if (!existingTicket.months) throw new Error('У призового билета не указано количество месяцев подписки');

      if (!existingUser.subscription) {
        await subscribeUser(userId, 'PRO', existingTicket.months, 0, tx);
      } else {
        await extendSubscription(userId, existingTicket.months, 0, tx);
      }

      await disconnectPrizeTicketFromUser(prizeTicketId, userId, tx);

      return { success: 'Призовой билет успешно применён' };
    });
  } catch (error) {
    console.error('Ошибка при применении призового билета: ', error);
    throw error;
  }
};
