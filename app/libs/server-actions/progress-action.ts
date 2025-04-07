'use server';

import { prisma } from '@/prisma/prisma';
import { calculateCourseProgress } from '../utils/progress';

// async function getCourseProgress(userId: string, courseId: string) {
//   return await prisma.userCourseProgress.findUnique({
//     where: { userId_courseId: { userId, courseId } },
//     include: {
//       completedLessons: true,
//       course: {
//         include: {
//           lessons: {
//             orderBy: { createdAt: 'asc' },
//           },
//         },
//       },
//     },
//   });
// }

// async function completeCourse(userId: string, courseId: string) {
//   return await prisma.$transaction(async (tx) => {
//     // Помечаем курс как завершенный
//     await tx.user.update({
//       where: { id: userId },
//       data: {
//         completedCourses: {
//           connect: { id: courseId },
//         },
//         coursesInProgress: {
//           disconnect: { id: courseId },
//         },
//       },
//     });

//     // Обновляем прогресс до 100%
//     return await tx.userCourseProgress.update({
//       where: { userId_courseId: { userId, courseId } },
//       data: {
//         progress: 100,
//         lastAccessedAt: new Date(),
//       },
//     });
//   });
// }

// async function updateCourseProgress(userId: string, courseId: string, lessonId: string) {
//   return await prisma.$transaction(async (tx) => {
//     // 1. Получаем или создаем запись о прогрессе
//     const progress = await tx.userCourseProgress.upsert({
//       where: { userId_courseId: { userId, courseId } },
//       create: {
//         userId,
//         courseId,
//       },
//       update: {
//         lastAccessedAt: new Date(),
//       },
//       include: {
//         completedLessons: true,
//         course: {
//           include: {
//             lessons: {
//               select: { id: true },
//             },
//           },
//         },
//       },
//     });

//     // 2. Проверяем, был ли урок уже завершен
//     const alreadyCompleted = progress.completedLessons.some((l) => l.id === lessonId);
//     if (alreadyCompleted) {
//       return progress;
//     }

//     // 3. Добавляем урок в завершенные
//     await tx.userCourseProgress.update({
//       where: { id: progress.id },
//       data: {
//         completedLessons: {
//           connect: { id: lessonId },
//         },
//       },
//     });

//     // 4. Пересчитываем прогресс
//     const totalLessons = progress.course.lessons.length;
//     const completedCount = progress.completedLessons.length + 1; // +1 для нового урока

//     const newProgress = Math.round((completedCount / totalLessons) * 100);

//     // 5. Обновляем процент прогресса
//     return await tx.userCourseProgress.update({
//       where: { id: progress.id },
//       data: {
//         progress: newProgress,
//         lastAccessedAt: new Date(),
//       },
//       include: {
//         completedLessons: true,
//         course: true,
//       },
//     });
//   });
// }

// 5. Расчет прогресса в реальном времени

export const getUserCoursesProgress = async (userId: string) => {
  try {
    const progress = await prisma.userCourseProgress.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(progress);

    return progress;
  } catch (error) {
    console.log(error);
  }
};

export const updateCourseProgress = async (userId: string, courseId: string, lessonId: string) => {
  try {
    const result = await prisma.$transaction(async () => {
      const progress = await prisma.userCourseProgress.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        create: {
          userId,
          courseId,
          currentLessonId: lessonId,
        },
        update: {
          currentLessonId: lessonId,
          lastAccessedAt: new Date(),
        },
        include: {
          completedLessons: {
            select: {
              id: true,
            },
          },
          course: {
            include: {
              lessons: {
                select: { id: true },
              },
            },
          },
        },
      });

      console.log(progress);

      const updatedProgress = calculateCourseProgress(progress.course.lessons.length, progress.completedLessons.length);
      await prisma.userCourseProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          progress: updatedProgress,
        },
      });
    });

    return { sucess: 'Прогресс успешно обновлен', result };
  } catch (error) {
    console.log(error);
  }
};
