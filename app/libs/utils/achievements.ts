import {
  TCriteria,
  TCourseCompletion,
  TExerciseCompletion,
  TCourseRegistration,
  TSubscription,
} from './../interfaces/interfaces';
import { prisma } from '@/prisma/prisma';
import { getCourseByName } from './courses';
import { getExerciseByName } from './exercises';
import { criteriaSchema } from '../validation';

export const getAchievementByName = async (name: string) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: {
        name,
      },
    });

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении курса по названию: ', error);
    throw error;
  }
};

export const getAchievementById = async (id: string) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: {
        id,
      },
    });

    return achievement;
  } catch (error) {
    console.error('Ошибка при получении курса по ID: ', error);
    throw error;
  }
};

export const getInvalidNames = async (type: 'courses' | 'exercises', names: string[]) => {
  const idsCheckPromises = names.map(async (name) => {
    const entity = type === 'courses' ? await getCourseByName(name) : await getExerciseByName(name);
    return { name, exists: !!entity };
  });

  const results = await Promise.all(idsCheckPromises);

  return results.filter((result) => !result.exists).map((result) => result.name);
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
    console.log('Ошибка при получении прогресса по достижению', error);

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
      whereCourse.priceUSD = { lte: criteria.minPrice };
    }

    const targetCourses = await prisma.course.findMany({
      where: whereCourse,
      include: {
        usersProgress: {
          select: { completedAt: true },
        },
      },
    });

    if (targetCourses.length === 0) {
      throw new Error('Курсы подходящие под данные критерии не найдены');
    }

    const completedTargetCourses = targetCourses.filter((course, index) => {
      return course.usersProgress.some((progress) => progress.completedAt !== null);
    });

    if (completedTargetCourses) {
      const progress = Math.floor((completedTargetCourses.length / targetCourses.length) * 100);
      return Math.min(progress, 100);
    }

    return 0;
  } catch (error) {
    console.log('Ошибка при получении прогресса по достижению', error);
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
      include: {
        usersProgress: {
          select: { completedAt: true },
        },
      },
    });

    if (targetCourses.length === 0) {
      throw new Error('Курсы подходящие под данные критерии не найдены');
    }

    const completedTargetCourses = targetCourses.filter((course, index) => {
      return course.usersProgress.some((progress) => progress.completedAt !== null);
    });

    if (completedTargetCourses) {
      const progress = Math.floor((completedTargetCourses.length / targetCourses.length) * 100);
      return Math.min(progress, 100);
    }

    return 0;
  } catch (error) {
    console.log('Ошибка при получении прогресса по достижению', error);
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
    console.log('Ошибка при получении прогресса по достижению', error);
    throw error;
  }
};

export const getNewProgress = async (criteria: TCriteria, userId: string) => {
  switch (criteria.type) {
    case 'EXERCISE_COMPLETION':
      return await getExerciseCompletionProgress(userId, criteria as TExerciseCompletion);

    case 'COURSE_COMPLETION':
      return await getCourseCompletionProgress(userId, criteria as TCourseCompletion);

    case 'COURSE_REGISTRATION':
      return await getCourseRegistrationProgress(userId, criteria as TCourseRegistration);

    case 'PARTICIPATION_LIMIT':
      return 0;

    case 'SUBSCRIPTION':
      return await getSubscriptionProgress(userId, criteria as TSubscription);

    case 'COMBINATION':
      return 0;

    default:
      const _exhaustiveCheck: never = criteria;
      return _exhaustiveCheck;
  }
};

export const updateAchievementProgress = async (achievementId: string, userId: string) => {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });

    if (!achievement) {
      throw new Error('Достижения с таким ID не существует');
    }

    const now = new Date();
    if (achievement.startDate > now) return;
    if (achievement.endDate && achievement.endDate < now) return;

    let userProgress = await prisma.userAchievementProgress.findUnique({
      where: { userId_achievementId: { userId, achievementId } },
    });

    if (!userProgress) {
      userProgress = await prisma.userAchievementProgress.create({
        data: {
          userId,
          achievementId,
          progress: 0,
          stepsCompleted: {},
        },
      });
    }

    let newProgress = 0;

    if (achievement.criteria && typeof achievement.criteria === 'object' && !Array.isArray(achievement.criteria)) {
      const criteria = criteriaSchema.parse(achievement.criteria) as TCriteria;
      newProgress = await getNewProgress(criteria, userId);
    }

    const isNowComplete = newProgress >= 100 && userProgress.progress < 100;

    await prisma.userAchievementProgress.update({
      where: {
        id: userProgress.id,
      },
      data: {
        progress: newProgress,
        ...(isNowComplete && { completedAt: new Date() }),
      },
    });
  } catch (error) {
    console.error('Ошибка при получении достижения по ID: ', error);
  }
};
