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
  meta: JsonValue;
  completedExercises?: IExercise[];
  completedTests?: ITest[];
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
  achievementTarget?: IAchievement[] | IAchievementPartial[];
  achievementPrize?: IAchievement[] | IAchievementPartial[];
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
  exercises: IExercise[];
  tests: ITest[];
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
  lesson?: ILesson;
  lessonId: string | null;
  completedUsers?: IUser[];
}

export interface ITestPartial {
  id: string;
  name: string;
}

export interface IAchievement {
  id: string;
  name: string;
  task: string;
  icon: string;
  language: string | null;
  requiredRank: string;
  discount: number;
  meta: JsonValue;
  targetCourses?: ICoursePartial[] | ICourse[];
  prizeCourses?: ICoursePartial[] | ICourse[];
  startedAt: Date;
  completedAt: Date | null;
}

export interface IAchievementPartial {
  id: string;
  name: string;
}

export interface IUserCourseProgress {
  id: string;
  user?: IUser;
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
