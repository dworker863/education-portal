import { fileUpload } from '@/app/libs/utils/auth';
import { getLessonByName } from '@/app/libs/utils/lessons';
import { createLessonSchema, editLessonSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images');
    const values: Record<string, FormDataEntryValue | FormDataEntryValue[]> =
      Object.fromEntries(
        [...formData.entries()].filter(([key]) => key !== 'images'),
      );

    values.images = images;

    const existingLesson = await getLessonByName(values.name as string);

    if (existingLesson) {
      return NextResponse.json(
        { error: 'Урок с таким названием уже существует' },
        { status: 409 },
      );
    }

    const { data, ...parsedResult } = createLessonSchema.safeParse(values);

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues[0].message },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let uploadImagesResult;
    let uploadVideoResult;

    if (data.images && data.images.length > 0) {
      uploadImagesResult = await Promise.all(
        data.images.map(async (image: File) => {
          return fileUpload(image);
        }),
      );

      const hasError = uploadImagesResult.some(
        (result) => result instanceof Error,
      );

      if (hasError) {
        return NextResponse.json(
          {
            error: 'Ошибка при загрузке файлов',
          },
          { status: 400 },
        );
      }

      uploadImagesResult = uploadImagesResult.filter(
        (result) => typeof result === 'string',
      );
    }

    if (data.video) {
      uploadVideoResult = await fileUpload(data.video);

      if (uploadVideoResult instanceof Error) {
        return NextResponse.json(
          { error: uploadVideoResult.message },
          { status: 400 },
        );
      }
    }

    await prisma.lesson.create({
      data: {
        name: data.name,
        content: data.content,
        images: uploadImagesResult || [],
        video: uploadVideoResult || null,
        courseId: data.courseId,
      },
    });

    return NextResponse.json(
      { success: 'Урок успешно добавлен' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Ошибка при создании урока:', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();

    const images = formData.getAll('images');
    const values: Record<string, FormDataEntryValue | FormDataEntryValue[]> =
      Object.fromEntries(
        [...formData.entries()].filter(([key]) => key !== 'images'),
      );

    values.images = images;
    const lessonId = values.id;

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Не указан ID урока' },
        { status: 400 },
      );
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId as string },
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Урок не найден' }, { status: 404 });
    }

    const { data, ...parsedResult } = await editLessonSchema.safeParse(values);

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues[0].message },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const fieldsToCheck = ['name', 'content', 'courseId'] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingLesson[field]) {
        updatedData[field] = data[field];
      }
    });

    const lesson = await getLessonByName(updatedData.name);

    if (lesson && lessonId !== lesson.id) {
      return NextResponse.json(
        { error: 'Урок с таким названием уже существует' },
        { status: 409 },
      );
    }

    if (data.images && data.images.length > 0) {
      const uploadImagesResult = await Promise.all(
        data.images.map(async (image: File) => {
          return fileUpload(image);
        }),
      );

      const hasError = uploadImagesResult.some(
        (result) => result instanceof Error,
      );

      if (hasError) {
        return NextResponse.json(
          {
            error: 'Ошибка при загрузке файлов',
          },
          { status: 400 },
        );
      }

      updatedData.images = uploadImagesResult;
    }

    if (data.video) {
      const uploadVideoResult = await fileUpload(data.video);

      if (uploadVideoResult instanceof Error) {
        return NextResponse.json(
          { error: uploadVideoResult.message },
          { status: 400 },
        );
      }

      updatedData.video = uploadVideoResult;
    }

    await prisma.lesson.update({
      where: { id: lessonId as string },
      data: updatedData,
    });

    return NextResponse.json(
      { success: 'Урок успешно изменен' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Ошибка при обновлении урока:', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}
