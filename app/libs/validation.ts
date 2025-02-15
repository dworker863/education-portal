import { z } from 'zod';

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Неверный email' }),
    username: z.optional(z.string()),
    password: z
      .string()
      .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/, 'Пароль должен содержать как буквы, так и цифры'),
    confirmPassword: z.string(),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    birthDate: z.optional(z.date()),
    image: z.optional(
      z
        .any()
        .refine((file) => !file || file instanceof File || file[0] instanceof File, {
          message: 'Файл должен быть валидным',
        })
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
      .string()
      .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/, 'Пароль должен содержать как буквы, так и цифры'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const createCourseSchema = z.object({
  name: z.string().min(1, { message: 'Введите название курса' }),
  description: z.string().min(1, { message: 'Введите описание курса' }),
  icon: z
    .any()
    .refine((file) => file, { message: 'Вставьте изображение для курса' })
    .refine((file) => file && (file instanceof File || file[0] instanceof File), {
      message: 'Файл должен быть валидным',
    })
    .refine((file) => file && (file.size > 0 || file[0]?.size > 0), {
      message: 'Файл не должен быть пустым',
    })
    .refine(
      (file) => {
        if (file instanceof File) {
          return file.type && file.type.includes('image');
        }

        return file && file[0]?.type && file[0].type.includes('image');
      },
      { message: 'Вставьте изображение' },
    ),
  priceUSD: z.number({ invalid_type_error: 'Введите число' }).min(0, { message: 'Введите цену курса' }),
  category: z.string().min(1, { message: 'Введите категорию курса' }),
});

export const editCourseSchema = createCourseSchema
  .extend({
    icon: z
      .any()
      .refine((file) => !file || file instanceof File || file[0] instanceof File, {
        message: 'Файл должен быть валидным',
      })
      .refine((file) => !file || file.size > 0 || file[0]?.size > 0, {
        message: 'Файл не должен быть пустым',
      })
      .refine(
        (file) => {
          if (file instanceof File) {
            return file.type && file.type.includes('image');
          }

          return !file || (file[0]?.type && file[0].type.includes('image'));
        },
        { message: 'Вставьте изображение' },
      ),
  })
  .partial();

export const createLessonSchema = z.object({
  name: z.string().min(1, { message: 'Введите название урока' }),
  content: z.string().min(1, { message: 'Введите текст урока' }),
  images: z.optional(
    z
      .array(
        z
          .any()
          .refine((file) => !file || file instanceof File, {
            message: 'Файл должен быть валидным',
          })
          .refine((file) => !file || file.size > 0, {
            message: 'Файл не должен быть пустым',
          })
          .refine(
            (file) => {
              if (!file) return true;
              return file.type && file.type.includes('image');
            },
            { message: 'Вставьте изображение' },
          ),
      )
      .nullable(),
  ),
  video: z.optional(
    z
      .any()
      .refine((file) => !file || file instanceof File || file[0] instanceof File, {
        message: 'Файл должен быть валидным',
      })
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

export const editLessonSchema = createLessonSchema.partial();

export const createExerciseSchema = z.object({
  name: z.string().min(1, { message: 'Введите название задания' }),
  task: z.string().min(1, { message: 'Введите задание' }),
  code: z.optional(z.string()),
  test: z.string().min(1, { message: 'Введите код теста' }),
  solution: z.string().min(1, { message: 'Укажите решение' }),
  language: z.string().min(1, { message: 'Укажите язык программирования' }),
  requiredRank: z.optional(z.string()),
  prizePoints: z.number({ invalid_type_error: 'Введите число' }).min(0, { message: 'Укажите баллы за задание' }),
  lessonId: z.optional(z.string()),
});

export const editExerciseSchema = createExerciseSchema.partial();

export const SelectSchema = z.object({
  language: z.string(),
  rank: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Укажите ранг',
  }),
});

export const createAchievementSchema = z.object({
  name: z.string().min(1, { message: 'Введите название достижения' }),
  task: z.string().min(1, { message: 'Введите описание' }),
  icon: z
    .any()
    .refine((file) => file, { message: 'Вставьте иконку достижения' })
    .refine((file) => file && (file instanceof File || file[0] instanceof File), {
      message: 'Файл должен быть валидным',
    })
    .refine((file) => file && (file.size > 0 || file[0]?.size > 0), {
      message: 'Файл не должен быть пустым',
    })
    .refine(
      (file) => {
        if (file instanceof File) {
          return file.type && file.type.includes('image');
        }

        return file && file[0]?.type && file[0].type.includes('image');
      },
      { message: 'Вставьте изображение' },
    ),
  language: z.optional(z.string()),
  requiredRank: z.optional(z.string()),
  discount: z.number({ invalid_type_error: 'Введите число' }).min(0, { message: 'Укажите баллы за задание' }),
  courseName: z.string().min(1, { message: 'Укажите курс, на который распространяется призовой бонус' }),
});
