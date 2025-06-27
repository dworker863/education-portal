import { JsonValue } from '@prisma/client/runtime/library';

export interface IUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: 'ADMIN' | 'USER';
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  rating: number;
  rank: string;
  moneyUSD: number;
  subsription: TSubscription | null;
  meta: JsonValue;
  completedExercises?: IExercise[];
  completedTests?: ITest[];
  discount?: IDiscount[];
  courseProgress?: IUserCourseProgress[];
  achievementsProgress?: IUserAchievementProgress[];
}

export interface ICourse {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceUSD: number;
  certificateId: string | null;
  category: string;
  meta: JsonValue;
  lessons?: ILesson[];
  usersProgress?: IUserCourseProgress[];
  discounts?: IDiscount[];
}

export interface ICoursePartial {
  id: string;
  name: string;
}

export interface ILesson {
  id: string;
  name: string;
  content: string;
  images: string | string[];
  video: string | null;
  meta: JsonValue;
  course?: ICourse;
  courseId: string;
  exercises?: IExercise[];
  tests?: ITest[];
  completedByUsers?: IUserCourseProgress[];
  currentInProgress?: IUserCourseProgress | null;
}

export interface ILessonPartial {
  id: string;
  name: string;
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
  meta: JsonValue;
  lesson?: ILesson;
  lessonId: string | null;
  completedUsers?: IUser[];
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
  lesson?: ILesson | null;
  lessonId: string | null;
  completedUsers?: IUser[];
}

export interface ITestPartial {
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

export interface IAchievementCriteria {
  type: TCriteriaType;
  condition:
    | TExerciseCompletion
    | TCourseCompletion
    | TCourseRegistration
    | TParticipationLimit
    | TSubscription
    | TCombination;
}

export type TCriteria =
  | TExerciseCompletion
  | TCourseCompletion
  | TCourseRegistration
  | TParticipationLimit
  | TSubscription
  | TCombination;

export type TCriteriaType =
  | 'EXERCISE_COMPLETION'
  | 'COURSE_COMPLETION'
  | 'COURSE_REGISTRATION'
  | 'PARTICIPATION_LIMIT'
  | 'SUBSCRIPTION'
  | 'COMBINATION';

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

export type TParticipationLimit = {
  type: 'PARTICIPATION_LIMIT';
  maxParticipants: number;
  requiredRank?: string;
};

export type TSubscription = {
  type: 'SUBSCRIPTION';
  tier: 'PRO' | 'PREMIUM';
  amount: number;
  firstTimeOnly: true;
};

export type TCombination = {
  type: 'COMBINATION';
  operator: 'AND' | 'OR';
  conditions: Array<
    TExerciseCompletion | TCourseCompletion | TCourseRegistration | TParticipationLimit | TSubscription
  >;
  requiredRank?: string;
};

export interface IReward {
  type: 'DISCOUNT' | 'SUBSCRIPTION';
  icon: string;
  amount: number;
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: JsonValue;
  criteriaType: string | TCriteriaType;
  reward: JsonValue;
  meta: JsonValue;
  startDate: Date;
  endDate: Date | null;
  usersProgress?: IUserAchievementProgress[];
}

export interface IAchievementPartial {
  id: string;
  name: string;
}

export interface IDiscount {
  id: string;
  code: string;
  user?: IUser;
  percent: number;
  courses?: ICourse[];
  minAmountToActivate: number;
  maxAmountToActivate: number;
  meta: JsonValue;
  validFrom: Date;
  validUntil: Date | null;
}

export interface IUserCourseProgress {
  id: string;
  user?: IUser;
  userId: string;
  course?: ICourse | ICoursePartial;
  courseId: string;
  completedLessons?: ILesson[];
  currentLesson?: ILesson | ILessonPartial;
  currentLessonId: string;
  progress: number;
  lastAccessedAt: Date;
  startedAt: Date;
  completedAt: Date | null;
  meta: JsonValue;
}
