import { z } from 'zod';

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Неверный email' }),
    username: z.optional(z.string()),
    password: z
      .string()
      .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
        'Пароль должен содержать как буквы, так и цифры',
      ),
    confirmPassword: z.string(),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    birthDate: z
      .optional(z.string())
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Неверная дата',
      })
      .refine((value) => !value || new Date(value) <= new Date(), {
        message: 'Дата рождения не может превышать сегодняшнюю дату',
      }),
    image: z.optional(
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
          { message: 'Вставьте изображение' },
        ),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: 'Неверный email' }),
  password: z.string().min(1, { message: 'Введите пароль' }),
  code: z.string({ message: 'Неверный код подтвеждения' }).optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Неверный email' }),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Введите пароль' })
      .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
        'Пароль должен содержать как буквы, так и цифры',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const courseSchema = z.object({
  name: z.string().min(1, { message: 'Введите название курса' }),
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
        { message: 'Вставьте изображение' },
      ),
  ),
  description: z.string().min(1, { message: 'Введите описание курса' }),
  priceUSD: z.string().min(1, { message: 'Введите цену курса' }),
  category: z.string().min(1, { message: 'Введите категорию курса' }),
});

export const lessonSchema = z.object({
  name: z.string().min(1, { message: 'Введите название урока' }),
  content: z.string().min(1, { message: 'Введите текст урока' }),
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
        { message: 'Вставьте изображение' },
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
        { message: 'Вставьте видео' },
      ),
  ),
  courseId: z.string(),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, { message: 'Введите название задания' }),
  task: z.string().min(1, { message: 'Введите задание' }),
  code: z.optional(z.string()),
  test: z.string().min(1, { message: 'Введите код теста' }),
  solution: z.string().min(1, { message: 'Укажите решение' }),
  requiredRank: z.optional(z.string()),
  prizePoints: z.string().min(1, { message: 'Укажите баллы за задание' }),
  lessonId: z.string(),
});
