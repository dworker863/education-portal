'use server';

import { createTestSchema, editTestSchema } from '../validation';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { getTestById, getTestByName } from '../utils/tests';

export const getAllTests = async () => {
  try {
    const tests = await prisma.test.findMany();
    return tests;
  } catch (error) {
    console.error('Ошибка при получении тестов: ', error);
    throw error;
  }
};

export const addTest = async (values: z.infer<typeof createTestSchema>) => {
  try {
    const existingTest = await getTestByName(values.name);

    if (existingTest) {
      throw new Error('Тест с таким названием уже существует');
    }

    const { data, ...parsedResult } = await createTestSchema.safeParse(values);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error?.issues[0].message);
    }

    if (!data) {
      throw new Error('Invalid data');
    }

    await prisma.test.create({
      data: {
        name: data.name,
        task: data.task,
        solution: data.solution,
        variants: data.variants,
        language: data.language,
        requiredRank: data.requiredRank || 'D-',
        prizePoints: data.prizePoints,
        lessonId: data.lessonId || null,
      },
    });

    return { success: 'Тест успешно добавлен' };
  } catch (error) {
    console.error('Ошибка при создании теста: ', error);
    throw error;
  }
};

export const editTest = async (id: string, values: z.infer<typeof editTestSchema>) => {
  console.log('SERVER ACTION: ', values);

  try {
    if (!id) {
      throw new Error('Не указан ID теста');
    }

    const existingTest = await getTestById(id);

    if (!existingTest) {
      throw new Error('Тест не найден');
    }

    const { data, ...parsedResult } = await editTestSchema.safeParse(values);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error?.issues[0].message);
    }

    if (!data) {
      throw new Error('Invalid data');
    }

    const fieldsToCheck = [
      'name',
      'task',
      'solution',
      'variants',
      'language',
      'requiredRank',
      'prizePoints',
      'lessonId',
    ] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (field === 'variants' && data.variants) {
        updatedData.variants = existingTest.variants.map((variant, index) => {
          if (!data.variants?.[index]) {
            return variant;
          }

          return data.variants?.[index] !== variant ? data.variants?.[index] : variant;
        });
      }

      if (data[field] && data[field] !== existingTest[field] && field !== 'variants') {
        updatedData[field] = field === 'prizePoints' ? Number(data[field]) : data[field];
      }
    });

    console.log('UPDATED_DATA: ', updatedData.variants);

    if (updatedData.name) {
      const test = await getTestByName(updatedData.name);

      if (test && id !== test.id) {
        throw Error('Тест с таким названием уже существует');
      }
    }

    await prisma.test.update({
      where: {
        id,
      },
      data: updatedData,
    });

    return { success: 'Тест успешно изменен' };
  } catch (error) {
    console.error('Ошибка при обновлении теста: ', error);
    throw error;
  }
};

export const deleteTest = async (id: string) => {
  try {
    const test = await getTestById(id);

    if (!test) throw new Error('Теста с таким ID не существует');

    await prisma.test.delete({
      where: {
        id,
      },
    });

    return { success: 'Тест успешно удален' };
  } catch (error) {
    console.error('Ошибка при удалении теста: ', error);
    throw error;
  }
};
