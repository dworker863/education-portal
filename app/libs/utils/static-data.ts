import { getCourseNames } from './../server-actions/courses-actions';
export const criteriaTypes = [
  {
    id: 'EXERCISE_COMPLETION',
    label: 'EXERCISE_COMPLETION',
  },
  {
    id: 'COURSE_COMPLETION',
    label: 'COURSE_COMPLETION',
  },
  {
    id: 'COURSE_REGISTRATION',
    label: 'COURSE_REGISTRATION',
  },

  {
    id: 'SUBSCRIPTION',
    label: 'SUBSCRIPTION',
  },
] as const;

export const ranks = [
  {
    id: 'D-',
    label: 'D-',
  },
  {
    id: 'D',
    label: 'D',
  },
  {
    id: 'D+',
    label: 'D+',
  },
  {
    id: 'C-',
    label: 'C-',
  },
  {
    id: 'C',
    label: 'C',
  },
  {
    id: 'C+',
    label: 'C+',
  },
  {
    id: 'B-',
    label: 'B-',
  },
  {
    id: 'B',
    label: 'B',
  },
  {
    id: 'B+',
    label: 'B+',
  },
  {
    id: 'A-',
    label: 'A-',
  },
  {
    id: 'A',
    label: 'A',
  },
  {
    id: 'A+',
    label: 'A+',
  },
] as const;

export const languages = [
  {
    id: 'JavaScript',
    label: 'JavaScript',
  },
  {
    id: 'Python',
    label: 'Python',
  },
  {
    id: 'Go',
    label: 'Go',
  },
  {
    id: 'Rust',
    label: 'Rust',
  },
  {
    id: 'C++',
    label: 'C++',
  },
  {
    id: 'C#',
    label: 'C#',
  },
] as const;

export const subscribeOffers = [
  {
    name: 'monthly',
    label: 'Подписка на месяц',
    amount: 1,
    price: 9.99,
  },
  {
    name: 'three-months',
    label: 'Подписка на три месяца',
    amount: 3,
    price: 19.99,
  },
  {
    name: 'six-months',
    label: 'Подписка на шесть месяцев',
    amount: 6,
    price: 39.99,
  },
];

export const courseNames = ['JavaScript', 'Python'];
