import { prisma } from '@/prisma/prisma';
import {
  TCourseCompletion,
  TCourseRegistration,
  TCriteria,
  TExerciseCompletion,
  TSubscription,
} from '../interfaces/interfaces';

export const calculateCourseProgress = (totalLessonsCount: number, completeLessonsCount: number) => {
  const progress = (completeLessonsCount / totalLessonsCount) * 100;
  return progress;
};

export const getExerciseCompletionProgress = async (userId: string, criteria: TExerciseCompletion) => {
  try {
    const whereExercise: any = {
      completedUsers: { some: { id: userId } },
    };

    if (criteria.requiredRank) {
      whereExercise.completedUsers = {
        ...whereExercise.completedUsers,
        some: { ...whereExercise.completedUsers.some, rank: criteria.requiredRank },
      };
    }

    if (criteria.language) {
      whereExercise.language = criteria.language;
    }

    const completedExercises = await prisma.exercise.findMany({
      where: whereExercise,
      select: {
        prizePoints: true,
      },
    });

    if (criteria.count) {
      const progress = Math.floor((completedExercises.length / criteria.count) * 100);
      return Math.min(progress, 100);
    }

    if (criteria.pointsToComplete) {
      const earnedPoints = completedExercises.reduce((sum, exercise) => (sum += exercise.prizePoints), 0);
      const progress = Math.floor((earnedPoints / criteria.pointsToComplete) * 100);
      return Math.min(progress, 100);
    }

    return 0;
  } catch (error) {
    console.error('Ошибка при получении прогресса по достижению', error);
    throw error;
  }
};

export const getCourseCompletionProgress = async (userId: string, criteria: TCourseCompletion) => {
  try {
    const whereCourse: any = {};

    if (criteria.courseNames && criteria.courseNames.length > 0) {
      whereCourse.name = { in: criteria.courseNames };
    }

    if (criteria.minPrice !== undefined) {
      whereCourse.priceUSD = { gte: criteria.minPrice };
    }

    if (criteria.maxPrice !== undefined) {
      whereCourse.priceUSD = { lte: criteria.maxPrice };
    }

    const targetCourses = await prisma.course.findMany({
      where: whereCourse,
      select: {
        id: true,
        name: true,
        usersProgress: {
          where: {
            userId,
          },
          select: { progress: true, completedAt: true },
        },
      },
    });

    if (targetCourses.length === 0) {
      throw new Error('Курсы подходящие под данные критерии не найдены');
    }

    const completedTargetCourses = targetCourses.filter((course, index) => {
      return course.usersProgress.some((progress) => progress.completedAt !== null);
    });

    if (completedTargetCourses.length > 0) {
      return 100;
    }

    return Math.max(...targetCourses.map((course) => course.usersProgress[0].progress));
  } catch (error) {
    console.error('Ошибка при получении прогресса по достижению', error);
    throw error;
  }
};

export const getCourseRegistrationProgress = async (userId: string, criteria: TCourseRegistration) => {
  try {
    const whereCourse: any = {};

    if (criteria.courseNames && criteria.courseNames.length > 0) {
      whereCourse.name = { in: criteria.courseNames };
    }

    if (criteria.minPrice !== undefined) {
      whereCourse.priceUSD = { gte: criteria.minPrice };
    }

    if (criteria.maxPrice !== undefined) {
      whereCourse.priceUSD = { lte: criteria.minPrice };
    }

    const targetCourses = await prisma.course.findMany({
      where: whereCourse,
      select: {
        id: true,
        name: true,
        usersProgress: {
          where: {
            userId,
          },
        },
      },
    });

    if (targetCourses.length !== 0) {
      return 100;
    }

    return 0;
  } catch (error) {
    console.error('Ошибка при получении прогресса по достижению', error);
    throw error;
  }
};

const getSubscriptionProgress = async (
  userId: string,
  criteria: TSubscription,
  amount?: number,
  tier?: 'PRO' | 'PREMIUM',
) => {
  try {
    const whereUser: any = {};
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        subscription: true,
      },
    });

    if (criteria.firstTimeOnly && user?.subscription) {
      throw new Error('Достижение для пользователей оформляющих подписку впервые');
    }

    if (tier !== criteria.tier) {
      throw new Error('Виды подпискок не совпадают');
    }

    if (amount && amount > 0) {
      const progress = Math.floor((amount / criteria.amount) * 100);
      return Math.min(progress, 100);
    }

    return 0;
  } catch (error) {
    console.error('Ошибка при получении прогресса по достижению', error);
    throw error;
  }
};

export const getNewProgress = async (userId: string, criteria: TCriteria) => {
  switch (criteria.type) {
    case 'EXERCISE_COMPLETION':
      return await getExerciseCompletionProgress(userId, criteria as TExerciseCompletion);

    case 'COURSE_COMPLETION':
      return await getCourseCompletionProgress(userId, criteria as TCourseCompletion);

    case 'COURSE_REGISTRATION':
      return await getCourseRegistrationProgress(userId, criteria as TCourseRegistration);

    case 'SUBSCRIPTION':
      return await getSubscriptionProgress(userId, criteria as TSubscription);

    default:
      const _exhaustiveCheck: never = criteria;
      return _exhaustiveCheck;
  }
};
