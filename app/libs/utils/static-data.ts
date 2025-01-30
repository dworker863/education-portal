export const ranks = [
  {
    id: 'd-',
    label: 'D-',
  },
  {
    id: 'd',
    label: 'D',
  },
  {
    id: 'd+',
    label: 'D+',
  },
  {
    id: 'c-',
    label: 'C-',
  },
  {
    id: 'c',
    label: 'C',
  },
  {
    id: 'c+',
    label: 'C+',
  },
  {
    id: 'b-',
    label: 'B-',
  },
  {
    id: 'b',
    label: 'B',
  },
  {
    id: 'b+',
    label: 'B+',
  },
  {
    id: 'a-',
    label: 'A-',
  },
  {
    id: 'a',
    label: 'A',
  },
  {
    id: 'a+',
    label: 'A+',
  },
] as const;

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  // ...
];
