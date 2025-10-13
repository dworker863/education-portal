import { PrizeTicketType } from '@prisma/client';
import { z } from 'zod';

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Неверный email' }),
    name: z.string().optional(),
    password: z
      .string()
      .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/, 'Пароль должен содержать как буквы, так и цифры'),
    confirmPassword: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthDate: z.date().optional(),
    referralCode: z.string().optional(),
    image: z
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
      )
      .optional(),
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

export const editProfileSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthDate: z.date().optional(),
  image: z
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
    )
    .optional(),
  code: z.string({ message: 'Неверный код подтвеждения' }).optional(),
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
  images: z
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
    .nullable()
    .optional(),
  video: z
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
    )
    .optional(),
  courseId: z.string(),
});

export const editLessonSchema = createLessonSchema.partial();

export const createExerciseSchema = z.object({
  name: z.string().min(1, { message: 'Введите название задания' }),
  task: z.string().min(1, { message: 'Введите задание' }),
  code: z.string().optional(),
  test: z.string().min(1, { message: 'Введите код теста' }),
  solution: z.string().min(1, { message: 'Укажите решение' }),
  language: z.string().min(1, { message: 'Укажите язык программирования' }),
  requiredRank: z.string().optional(),
  prizePoints: z.number({ invalid_type_error: 'Введите число' }).min(5, { message: 'Укажите баллы за задание' }),
  lessonId: z.string().optional(),
});

export const editExerciseSchema = createExerciseSchema.partial();

export const exercisesFiltersSchema = z.object({
  language: z.string(),
  rank: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Укажите ранг',
  }),
});

const baseTestSchema = z.object({
  name: z.string().min(1, { message: 'Введите название задания' }),
  task: z.string().min(1, { message: 'Введите задание' }),
  variants: z.array(z.string().min(1, { message: 'Вариант не может быть пустым' })),
  solution: z.string().min(1, { message: 'Укажите решение' }),
  language: z.string().min(1, { message: 'Укажите язык программирования' }),
  requiredRank: z.string().optional(),
  prizePoints: z.number({ invalid_type_error: 'Введите число' }).min(5, { message: 'Укажите баллы за задание' }),
  lessonId: z.string().optional(),
});

export const createTestSchema = baseTestSchema.refine(
  (data) => data.variants.some((variant) => variant === data.solution),
  {
    message: 'Решение должно совпадать с одним из вариантов',
    path: ['solution'],
  },
);

export const editTestSchema = baseTestSchema
  .extend({
    variants: z.array(z.string()).optional(), // Делаем variants необязательным
  })
  .partial();

const exerciseCompletionSchema = z.object({
  type: z.literal('EXERCISE_COMPLETION'),
  count: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите необходимое количество упражнений' })
    .optional(),
  language: z.string().optional(),
  pointsToComplete: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите необходимое количество очков' })
    .optional(),
  requiredRank: z.string().optional(),
});

const courseCompletionSchema = z.object({
  type: z.literal('COURSE_COMPLETION'),
  courseNames: z.array(z.string()).optional(),
  minPrice: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите минимальную цену курса' })
    .optional(),
  maxPrice: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите максимальную курса' })
    .optional(),
  requiredRank: z.string().optional(),
});

const courseRegistrationSchema = z.object({
  type: z.literal('COURSE_REGISTRATION'),
  courseNames: z.array(z.string()).optional(),
  minPrice: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите минимальную цену курса' })
    .optional(),
  maxPrice: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите максимальную курса' })
    .optional(),
  requiredRank: z.string().optional(),
});

const subscriptionSchema = z.object({
  type: z.literal('SUBSCRIPTION'),
  amount: z
    .number({ invalid_type_error: 'Введите число' })
    .min(1, { message: 'Введите количество необходимых месяцев/лет подписки' }),
  firstTimeOnly: z.boolean(),
});

export const criteriaSchema = z.discriminatedUnion('type', [
  exerciseCompletionSchema,
  courseCompletionSchema,
  courseRegistrationSchema,
  subscriptionSchema,
]);

export const rewardSchema = z.object({
  type: z.enum(['DISCOUNT', 'SUBSCRIPTION']),
  icon: z
    .any()
    .refine((file) => file, { message: 'Вставьте изображение для достижения' })
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
  months: z
    .number({ invalid_type_error: 'Введите число' })
    .min(1, { message: 'Введите количество месяцев подписки' })
    .optional(),
  percent: z.number({ invalid_type_error: 'Введите число' }).min(1, { message: 'Введите процент скидки' }).optional(),
});

export const createAchievementSchema = z.object({
  name: z.string().min(1, { message: 'Введите название достижения' }),
  description: z.string().min(1, { message: 'Введите описание' }),
  icon: z
    .any()
    .refine((file) => file, { message: 'Вставьте изображение для достижения' })
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
  startDate: z.date(),
  endDate: z.date().optional(),
  criteria: criteriaSchema,
  reward: rewardSchema,
});

export const editCriteriaSchema = z.union([
  exerciseCompletionSchema.partial(),
  courseCompletionSchema.partial(),
  courseRegistrationSchema.partial(),
  subscriptionSchema.partial(),
]);

export const editAchievementSchema = createAchievementSchema
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
    criteria: editCriteriaSchema,
    reward: rewardSchema
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
      .partial(),
  })
  .partial();

const exerciseCompletionFiltersSchema = z.object({
  type: z.literal('EXERCISE_COMPLETION'),
  languages: z.array(z.string()).optional(),
  requiredRank: z.array(z.string()).optional(),
});

const courseCompletionFiltersSchema = z.object({
  type: z.literal('COURSE_COMPLETION'),
  courseNames: z.array(z.string()).optional(),
  requiredRank: z.array(z.string()).optional(),
});

const courseRegistrationFiltersSchema = z.object({
  type: z.literal('COURSE_REGISTRATION'),
  courseNames: z.array(z.string()).optional(),
  requiredRank: z.array(z.string()).optional(),
});

const subscriptionFiltersSchema = z.object({
  type: z.literal('SUBSCRIPTION'),
  duration: z.enum(['MONTHLY', 'YEARLY']).optional(),
  firstTimeOnly: z.boolean().optional(),
});

export const achievementsFiltersSchema = z.object({
  criteriaType: z
    .array(z.enum(['EXERCISE_COMPLETION', 'COURSE_COMPLETION', 'COURSE_REGISTRATION', 'SUBSCRIPTION']))
    .optional(),
  criteriaTypeFilters: z
    .array(
      z.discriminatedUnion('type', [
        exerciseCompletionFiltersSchema,
        courseCompletionFiltersSchema,
        courseRegistrationFiltersSchema,
        subscriptionFiltersSchema,
      ]),
    )
    .optional(),
  rewardType: z.enum(['DISCOUNT', 'SUBSCRIPTION']).optional(),
});

export const createPrizeTicketSchema = z.object({
  code: z.string().min(3, 'Код должен содержать минимум 3 символа'),
  name: z.string().optional(),
  type: z.nativeEnum(PrizeTicketType, { errorMap: () => ({ message: 'Неверный тип билета' }) }),
  percent: z.number().min(0).max(100).optional(),
  months: z.number().min(1).optional(),
  minAmountToActivate: z.number().min(0).optional(),
  maxAmountToActivate: z.number().min(0).optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
});

export const editPrizeTicketSchema = createPrizeTicketSchema.partial();
