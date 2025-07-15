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
    id: 'PARTICIPATION_LIMIT',
    label: 'PARTICIPATION_LIMIT',
  },
  {
    id: 'SUBSCRIPTION',
    label: 'SUBSCRIPTION',
  },
] as const;

export const extendedCriteriaTypes = [
  ...criteriaTypes,
  {
    id: 'COMBINATION',
    label: 'COMBINATION',
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
