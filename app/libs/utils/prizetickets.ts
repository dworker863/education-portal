import { prisma } from '@/prisma/prisma';

export const getPrizeTicketById = async (id: string) => {
  try {
    const prizeTicket = await prisma.prizeTicket.findUnique({
      where: {
        id,
      },
    });

    return prizeTicket;
  } catch (error) {
    console.error('Ошибка при получении призового билета по ID: ', error);
    throw error;
  }
};

export const getPrizeTicketByCode = async (code: string) => {
  try {
    const prizeTicket = await prisma.prizeTicket.findFirst({
      where: {
        code,
      },
    });

    return prizeTicket;
  } catch (error) {
    console.error('Ошибка при получении призового билета по коду: ', error);
    throw error;
  }
};

export const getPrizeTicketByName = async (name: string) => {
  try {
    const prizeTicket = await prisma.prizeTicket.findFirst({
      where: {
        name,
      },
    });

    return prizeTicket;
  } catch (error) {
    console.error('Ошибка при получении призового билета по коду: ', error);
    throw error;
  }
};
