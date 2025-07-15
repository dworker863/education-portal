import { prisma } from '@/prisma/prisma';

export const getAllLessons = async () => {
  try {
    const lessons = await prisma.lesson.findMany();
    return lessons;
  } catch (error) {
    console.error('Ошибка при получении уроков: ', error);
    throw error;
  }
};

export const getPartialLessons = async () => {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return lessons;
  } catch (error) {
    console.error('Ошибка при получении уроков: ', error);
    throw error;
  }
};

export const getLessonByName = async (name: string) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        name,
      },
      include: {
        exercises: true,
        tests: true,
      },
    });

    return lesson;
  } catch (error) {
    console.error('Ошибка при получении урока по названию: ', error);
    throw error;
  }
};

export const getLessonById = async (id: string) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    return lesson;
  } catch (error) {
    console.error('Ошибка при получении урока по ID: ', error);
    throw error;
  }
};

export const checkLesson = (passedExercises: string[], totalExercises: string[]) => {
  console.log('CHECK LESSON PASSED', passedExercises);
  console.log('CHECK LESSON TOTAL', totalExercises);

  const result = (passedExercises.length / totalExercises.length) * 100;

  console.log('CHECK LESSON RESULT', result);

  if (result < 75) {
    return false;
  } else {
    return true;
  }
};
