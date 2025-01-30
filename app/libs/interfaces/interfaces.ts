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
  coursesInProgress?: ICourse[];
  completedCourses?: ICourse[];
  completedExercises?: IExercise[];
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
  usersInProgress?: IUser[];
  completedUsers?: IUser[];
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
  exercise?: IExercise;
}

export interface IExercise {
  id: string;
  name: string;
  task: string;
  code: string | null;
  test: string;
  solution: string;
  requiredRank: string;
  prizePoints: number;
  meta: JsonValue;
  lesson?: ILesson;
  lessonId: string | null;
  completedUsers?: IUser[];
}
