import { JsonValue } from '@prisma/client/runtime/library';

export interface IUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  rating: number;
  rank: string;
  moneyUSD: number;
  referralCode: string;
  referredById: string | null;
  hasFirstPurchase: boolean;
  subsription: TSubscription | null;
  meta: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  role: 'ADMIN' | 'USER';
  referredBy: IUser | IUserPartial | null;
  referrals: (IUser | IUserPartial)[];
  completedExercises?: (IExercise | IExercisePartial)[];
  completedTests?: (ITest | ITestPartial)[];
  prizeTickets?: (IPrizeTicket | IPrizeTicketPartial)[];
  courseProgress?: (IUserCourseProgress | IUserCourseProgressPartial)[];
  achievementsProgress?: (
    | IUserAchievementProgress
    | IUserAchievementProgressPartial
  )[];
}

export interface IUserPartial {
  id: string;
  name: string;
  email: string;
}

export interface ICourse {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceUSD: number;
  certificateId: string | null;
  category: string;
  tags: string[];
  meta: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  lessons?: (ILesson | ILessonPartial)[];
  usersProgress?: (IUserCourseProgress | IUserCourseProgressPartial)[];
  prizeTickets?: (IPrizeTicket | IPrizeTicketPartial)[];
}

export interface ICoursePartial {
  id: string;
  name: string;
}

export interface IUserCourseProgress {
  id: string;
  completedLessons?: (ILesson | ILessonPartial)[];
  currentLesson?: ILesson | ILessonPartial;
  currentLessonId: string;
  progress: number;
  lastAccessedAt: Date;
  startedAt: Date;
  completedAt: Date | null;
  meta: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  user?: IUser | IUserPartial;
  userId: string;
  course?: ICourse | ICoursePartial;
  courseId: string;
}

export interface IUserCourseProgressPartial {
  id: string;
  progress: number;
  completedAt?: Date | null;
  currentLesson?: ILesson | ILessonPartial;
  userId: string;
  user?: IUser | IUserPartial;
  courseId: string;
  course?: ICourse | ICoursePartial;
}

export interface ILesson {
  id: string;
  name: string;
  content: string;
  images: string | string[];
  video: string | null;
  meta: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  course?: ICourse | ICoursePartial;
  courseId: string;
  exercises?: (IExercise | IExercisePartial)[];
  tests?: (ITest | ITestPartial)[];
  completedByUsers?: (IUserCourseProgress | IUserCourseProgressPartial)[];
  currentInProgress?: IUserCourseProgress | IUserCourseProgressPartial | null;
}

export interface ILessonPartial {
  id: string;
  name: string;
  createdAt: Date;
}

export interface IExercise {
  id: string;
  name: string;
  task: string;
  code: string | null;
  test: string;
  solution: string;
  language: string;
  requiredRank: string;
  prizePoints: number;
  tags: string[];
  meta: JsonValue;
  lesson?: ILesson | ILessonPartial;
  lessonId: string | null;
  completedUsers?: (IUser | IUserPartial)[];
}

export interface IExercisePartial {
  id: string;
  name: string;
}

export interface ITest {
  id: string;
  name: string;
  task: string;
  variants: string[];
  solution: string;
  language: string;
  requiredRank: string;
  prizePoints: number;
  meta: JsonValue;
  lesson?: ILesson | ILessonPartial | null;
  lessonId: string | null;
  completedUsers?: (IUser | IUserPartial)[];
}

export interface ITestPartial {
  id: string;
  name: string;
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: JsonValue;
  criteriaType: string | TCriteriaType;
  maxUsers: number | null;
  reward: JsonValue;
  meta: JsonValue;
  startDate: Date;
  endDate: Date | null;
  usersProgress?: (
    | IUserAchievementProgress
    | IUserAchievementProgressPartial
  )[];
}

export interface IAchievementPartial {
  id: string;
  name: string;
}

export interface IUserAchievementProgress {
  id: string;
  user?: IUser;
  userId: string;
  achievement?: IAchievement | IAchievementPartial;
  achievementId: string;
  progress: number;
  stepsCompleted: JsonValue;
  startedAt: Date;
  completedAt: Date | null;
  meta: JsonValue;
}

export interface IUserAchievementProgressPartial {
  id: string;
  progress: number;
  completedAt?: Date | null;
  achievement?: IAchievement | IAchievementPartial;
}

export type TCriteriaType =
  | 'EXERCISE_COMPLETION'
  | 'COURSE_COMPLETION'
  | 'COURSE_REGISTRATION'
  | 'SUBSCRIPTION';

export type TCriteria =
  | TExerciseCompletion
  | TCourseCompletion
  | TCourseRegistration
  | TSubscription;

export interface IAchievementCriteria {
  type: TCriteriaType;
  condition:
    | TExerciseCompletion
    | TCourseCompletion
    | TCourseRegistration
    | TSubscription;
}

export type TExerciseCompletion = {
  type: 'EXERCISE_COMPLETION';
  count?: number;
  language?: string;
  pointsToComplete?: number;
  requiredRank?: string;
};

export type TCourseCompletion = {
  type: 'COURSE_COMPLETION';
  courseNames?: string[];
  minPrice?: number;
  maxPrice?: number;
  requiredRank?: string;
};

export type TCourseRegistration = {
  type: 'COURSE_REGISTRATION';
  courseNames?: string[];
  minPrice?: number;
  maxPrice?: number;
  requiredRank?: string;
};

export type TSubscription = {
  type: 'SUBSCRIPTION';
  amount: number;
  firstTime?: boolean;
  startedAt: Date;
  validUntil: Date;
};

export interface IReward {
  type: 'DISCOUNT' | 'SUBSCRIPTION';
  icon: string;
  months?: number;
  percent?: number;
}

export interface IPrizeTicket {
  id: string;
  type: 'DISCOUNT' | 'SUBSCRIPTION';
  code: string;
  name: string | null;
  user?: IUser;
  percent: number | null;
  months: number | null;
  courses?: (ICourse | ICoursePartial)[];
  minAmountToActivate: number;
  maxAmountToActivate: number;
  meta: JsonValue;
  validFrom: Date;
  validUntil: Date | null;
}

export interface IPrizeTicketPartial {
  id: string;
  type: 'DISCOUNT' | 'SUBSCRIPTION';
  percent?: number;
  months?: number;
  validUntil: Date | null;
}

export interface IIndexCourse {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface IIndexExercise {
  id: string;
  name: string;
  task: string;
  language: string;
  tags: string[];
}
