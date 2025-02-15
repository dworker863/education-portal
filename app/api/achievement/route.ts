import { getAchievementByName } from '@/app/libs/utils/achievements';
import { fileUpload } from '@/app/libs/utils/auth';
import { createAchievementSchema } from '@/app/libs/validation';
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { getCourseByName } from '@/app/libs/utils/courses';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);

    const existingAchievement = await getAchievementByName(values.name as string);

    if (existingAchievement) {
      return NextResponse.json({ error: 'Достижение с таким названием уже существует' }, { status: 409 });
    }

    const existingCourse = await getCourseByName(values.courseName as string);

    if (!existingCourse) {
      return NextResponse.json({ error: 'Курса с таким названием не существует' }, { status: 404 });
    }

    const { data, ...parsedResult } = await createAchievementSchema.safeParse({
      ...values,
      discount: values.discount ? Number(values.discount) : null,
    });

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.issues[0].message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let uploadResult;

    if (data.icon) {
      uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message }, { status: 400 });
      }
    }

    await prisma.achievement.create({
      data: {
        name: data.name,
        task: data.task,
        icon: uploadResult as string,
        language: data.language || null,
        requiredRank: data.requiredRank || 'D-',
        discount: data.discount,
        courseId: existingCourse.id,
      },
    });

    return NextResponse.json({ success: 'Достижение успешно добавлено' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при создании достижения: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}
