import { fileUpload } from '@/app/libs/utils/common';
import { getCourseById, getCourseByName } from '@/app/libs/utils/courses';
import { createCourseSchema, editCourseSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);

    const existingCourse = await getCourseByName(values.name as string);

    if (existingCourse) {
      return NextResponse.json({ error: 'Курс с таким названием уже существует' }, { status: 409 });
    }

    const { data, ...parsedResult } = await createCourseSchema.safeParse({
      ...values,
      priceUSD: values.priceUSD ? Number(values.priceUSD) : null,
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

    await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        icon: uploadResult as string,
        priceUSD: data.priceUSD,
        certificateId: 'test',
        category: data.category,
      },
    });

    return NextResponse.json({ success: 'Курс успешно добавлен' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при создании курса: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);
    const courseId = values.id;

    if (!courseId) {
      return NextResponse.json({ error: 'Не указан ID курса' }, { status: 400 });
    }

    const existingCourse = await getCourseById(courseId as string);

    if (!existingCourse) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    const { data, ...parsedResult } = await editCourseSchema.safeParse({
      ...values,
      priceUSD: values.priceUSD ? Number(values.priceUSD) : null,
    });

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.issues[0].message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const fieldsToCheck = ['name', 'description', 'priceUSD', 'category'] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingCourse[field]) {
        updatedData[field] = data[field];
      }
    });

    if (updatedData.name) {
      const course = await getCourseByName(updatedData.name);

      if (course && courseId !== course.id) {
        return NextResponse.json({ error: 'Курс с таким названием уже существует' }, { status: 409 });
      }
    }

    if (data.icon) {
      const uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message }, { status: 400 });
      }

      updatedData.icon = uploadResult;
    }

    await prisma.course.update({
      where: { id: courseId as string },
      data: updatedData,
    });

    return NextResponse.json({ success: 'Курс успешно изменен' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении курса: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}
