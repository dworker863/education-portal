import { prisma } from '@/prisma/prisma';

export const getAllTests = async () => {
  try {
    const tests = await prisma.test.findMany();
    return tests;
  } catch (error) {
    console.error('Ошибка при получении тестов: ', error);
    throw error;
  }
};

export const getTestById = async (id: string) => {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id,
      },
    });

    return test;
  } catch (error) {
    console.error('Ошибка при получении теста по ID: ', error);
    throw error;
  }
};

export const getTestByName = async (name: string) => {
  try {
    const test = await prisma.test.findFirst({
      where: {
        name,
      },
    });

    return test;
  } catch (error) {
    console.error('Ошибка при получении теста по названию: ', error);
    throw error;
  }
};
