export interface ICourse {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  certificateId: string | null;
  category: string;
  priceUSD: number;
  completedUsersCount: number;
  usersIds: string[];
  meta: string[];
}

export interface ILesson {
  id: string;
  name: string;
  content: string;
  images: string | string[];
  video: string | null;
  courseId: string;
  exercise: IExercise | null;
  exerciseId: string | null;
}

export interface IExercise {
  id: string;
  name: string;
  task: string;
  code: string | null;
  test: string;
  solution: string;
  requiredRank: string | null;
  prizePoints: number;
  lessonId: string | null;
  meta: String[];
}
