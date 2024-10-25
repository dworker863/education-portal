import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Incorrect email address' }),
  password: z.string().min(1, { message: 'Passwrod is required' }),
  code: z.string({ message: 'Enter verification code' }).optional(),
});

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Incorrect email address' }),
    username: z.optional(z.string()),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must contain at least 6 symbols' })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
        'Пароль должен содержать как буквы, так и цифры',
      ),
    confirmPassword: z.string(),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    birthDate: z
      .string()
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Invalid date',
      })
      .refine((value) => !value || new Date(value) <= new Date(), {
        message: 'Дата рождения не может превышать сегодняшнюю дату',
      }),
    file: z.optional(
      z
        .any()
        .refine(
          (file) => !file || file instanceof File || file[0] instanceof File,
          {
            message: 'Файл должен быть валидным',
          },
        )
        .refine((file) => !file || file.size > 0 || file[0]?.size > 0, {
          message: 'Файл не должен быть пустым',
        })
        .refine(
          (file) => {
            if (!file) return true;
            if (file instanceof File) {
              return file.type && file.type.includes('image');
            }

            return file[0]?.type && file[0].type.includes('image');
          },
          { message: 'Insert image' },
        ),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Incorrect email address' }),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must contain at least 6 symbols' })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
        'Пароль должен содержать как буквы, так и цифры',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword'],
  });

export const lessonSchema = z.object({
  name: z.string().min(1, { message: 'Add lesson name' }),
  content: z.string().min(1, { message: 'Add lesson content' }),
  images: z.optional(
    z
      .any()
      .refine(
        (file) => !file || file instanceof File || file[0] instanceof File,
        {
          message: 'Файл должен быть валидным',
        },
      )
      .refine((file) => !file || file.size > 0 || file[0]?.size > 0, {
        message: 'Файл не должен быть пустым',
      })
      .refine(
        (file) => {
          if (!file) return true;
          if (file instanceof File) {
            return file.type && file.type.includes('image');
          }

          return file[0]?.type && file[0].type.includes('image');
        },
        { message: 'Insert image' },
      ),
  ),
  video: z.optional(
    z
      .any()
      .refine(
        (file) => !file || file instanceof File || file[0] instanceof File,
        {
          message: 'Файл должен быть валидным',
        },
      )
      .refine((file) => !file || file.size > 0 || file[0]?.size > 0, {
        message: 'Файл не должен быть пустым',
      })
      .refine(
        (file) => {
          if (!file) return true;
          if (file instanceof File) {
            return file.type && file.type.includes('video');
          }

          return file[0]?.type && file[0].type.includes('video');
        },
        { message: 'Insert video' },
      ),
  ),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, { message: 'Add exercise name' }),
  task: z.string().min(1, { message: 'Add task' }),
  code: z.optional(z.string()),
  test: z.string().min(1, { message: 'Add test' }),
  solution: z.string().min(1, { message: 'Add solution' }),
  requiredRank: z.optional(z.string()),
  prizePoints: z.string().min(1, { message: 'Add prize points' }),
});

export const courseSchema = z.object({
  name: z.string().min(1, { message: 'Add course name' }),
  icon: z.optional(
    z
      .any()
      .refine(
        (file) => !file || file instanceof File || file[0] instanceof File,
        {
          message: 'Файл должен быть валидным',
        },
      )
      .refine((file) => !file || file.size > 0 || file[0]?.size > 0, {
        message: 'Файл не должен быть пустым',
      })
      .refine(
        (file) => {
          if (!file) return true;
          if (file instanceof File) {
            return file.type && file.type.includes('image');
          }

          return file[0]?.type && file[0].type.includes('image');
        },
        { message: 'Insert image' },
      ),
  ),
  priceUSD: z.string().min(1, { message: 'Add course price' }),
  category: z.string().min(1, { message: 'Add course category' }),
});
