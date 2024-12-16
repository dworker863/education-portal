import { fileUpload } from '@/app/libs/utils/auth';
import { createCourseSchema, editCourseSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const { data, ...parsedValues } = await createCourseSchema.safeParse(
      values,
    );

    if (!parsedValues.success) {
      return NextResponse.json({ error: parsedValues.error.issues[0].message });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' });
    }

    let uploadResult;

    if (data.icon) {
      uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message });
      }
    }

    await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        icon: uploadResult as string,
        priceUSD: Number(data.priceUSD),
        certificateId: 'test',
        completedUsersCount: 0,
        category: data.category,
      },
    });

    return NextResponse.json({ success: 'Курс успешно добавлен' });
  } catch (error) {
    throw error;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());
    const courseId = values.id;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Не указан ID курса' },
        { status: 400 },
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId as string },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    const { data, ...parsedValues } = await editCourseSchema.safeParse(values);

    if (!parsedValues.success) {
      return NextResponse.json({ error: parsedValues.error.issues[0].message });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' });
    }

    let uploadResult;

    if (data.icon) {
      uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message });
      }
    }

    const updatedData = {
      name: data.name || existingCourse.name,
      description: data.description || existingCourse.description,
      icon: uploadResult || existingCourse.icon,
      priceUSD: data.priceUSD ? Number(data.priceUSD) : existingCourse.priceUSD,
      category: data.category || existingCourse.category,
    };

    await prisma.course.update({
      where: { id: courseId as string },
      data: updatedData,
    });

    return NextResponse.json({ success: 'Курс успешно изменен' });
  } catch (error) {
    throw error;
  }
}
