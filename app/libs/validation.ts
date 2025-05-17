import { z } from 'zod';

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Неверный email' }),
    name: z.optional(z.string()),
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
  pointsToComplete: z.number({ invalid_type_error: 'Введите число' }).min(0, { message: 'Укажите баллы за задание' }),
  lessonId: z.optional(z.string()),
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
  requiredRank: z.optional(z.string()),
  pointsToComplete: z.number({ invalid_type_error: 'Введите число' }).min(0, { message: 'Укажите баллы за задание' }),
  lessonId: z.optional(z.string()),
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
  count: z.optional(z.number({ invalid_type_error: 'Введите число' })),
  language: z.optional(z.string()),
  pointsToComplete: z.optional(z.number({ invalid_type_error: 'Введите число' })),
  requiredRank: z.optional(z.string()),
});

const courseCompletionSchema = z.object({
  type: z.literal('COURSE_COMPLETION'),
  coursesIds: z.array(z.string()).optional(),
  minPrice: z.optional(z.number({ invalid_type_error: 'Введите число' })),
  maxPrice: z.optional(z.number({ invalid_type_error: 'Введите число' })),
  requiredRank: z.optional(z.string()),
});

const courseRegistrationSchema = z.object({
  type: z.literal('COURSE_REGISTRATION'),
  coursesIds: z.array(z.string()).optional(),
  minPrice: z.optional(z.number({ invalid_type_error: 'Введите число' })),
  maxPrice: z.optional(z.number({ invalid_type_error: 'Введите число' })),
  requiredRank: z.optional(z.string()),
});

const participationLimitSchema = z.object({
  type: z.literal('PARTICIPATION_LIMIT'),
  maxParticipants: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите количество пользователей, на которых расчитана награда ' }),
  requiredRank: z.optional(z.string()),
});

const subscriptionSchema = z.object({
  type: z.literal('SUBSCRIPTION'),
  tier: z.enum(['PRO', 'PREMIUM']),
  duration: z.enum(['MONTHLY', 'YEARLY']),
  amount: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите количество необходимых месяцев/лет подписки' }),
  firstTimeOnly: z.boolean(),
});

const combinationSchema = z.object({
  type: z.literal('COMBINATION'),
  operator: z.enum(['AND', 'OR']),
  types: z.array(
    z.enum(['EXERCISE_COMPLETION', 'COURSE_COMPLETION', 'COURSE_REGISTRATION', 'PARTICIPATION_LIMIT', 'SUBSCRIPTION']),
  ),
  conditions: z.array(
    z.discriminatedUnion('type', [
      exerciseCompletionSchema,
      courseCompletionSchema,
      courseRegistrationSchema,
      participationLimitSchema,
      subscriptionSchema,
    ]),
  ),
  requiredRank: z.string().optional(),
});

export const criteriaSchema = z.discriminatedUnion('type', [
  exerciseCompletionSchema,
  courseCompletionSchema,
  courseRegistrationSchema,
  participationLimitSchema,
  subscriptionSchema,
  combinationSchema,
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
  amount: z
    .number({ invalid_type_error: 'Введите число' })
    .min(0, { message: 'Введите количество призовых билетовых со скидкой' }),
  subscriptionType: z.enum(['DAYS', 'MONTHS', 'YEARS']),
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
  endDate: z.optional(z.date()),
  criteria: criteriaSchema,
  reward: rewardSchema,
});

const exerciseCompletionFiltersSchema = z.object({
  language: z.optional(z.string()),
  requiredRank: z.optional(z.string()),
});

const courseCompletionFiltersSchema = z.object({
  coursesNames: z.array(z.string()).optional(),
  requiredRank: z.array(z.string()).optional(),
});

const courseRegistrationFiltersSchema = z.object({
  coursesNames: z.array(z.string()).optional(),
  requiredRank: z.array(z.string()).optional(),
});

export const achievementsFiltersSchema = z.object({
  language: z.optional(z.string()),
  rank: z.array(z.string()).optional(),
  // courseName: z
  //   .array(z.string())
  //   .refine((value) => value.some((item) => item), {
  //     message: 'Укажите курс',
  //   })
  //   .optional(),
  criteriaType: z
    .array(
      z.enum([
        'EXERCISE_COMPLETION',
        'COURSE_COMPLETION',
        'COURSE_REGISTRATION',
        'PARTICIPATION_LIMIT',
        'SUBSCRIPTION',
      ]),
    )
    .optional(),
  criteriaTypeFilters: z.array(
    z.union([exerciseCompletionFiltersSchema, courseCompletionFiltersSchema, courseRegistrationFiltersSchema]),
  ),
  rewardType: z.enum(['DISCOUNT', 'SUBSCRIPTION']).optional(),
});

export const editCriteriaSchema = z.union([
  exerciseCompletionSchema.partial(),
  courseCompletionSchema.partial(),
  courseRegistrationSchema.partial(),
  participationLimitSchema.partial(),
  subscriptionSchema.partial(),
  combinationSchema.partial(),
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

export const editProfileSchema = z.object({
  name: z.optional(z.string()),
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
  code: z.string({ message: 'Неверный код подтвеждения' }).optional(),
});
