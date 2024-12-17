import { fileUpload } from '@/app/libs/utils/auth';
import { createLessonSchema, editLessonSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images');
    const values: { [key: string]: FormDataEntryValue | FormDataEntryValue[] } =
      Object.fromEntries(
        [...formData.entries()].filter(([key]) => key !== 'images'),
      );

    values.images = images;

    const { data, ...parsedValues } = createLessonSchema.safeParse(values);

    if (!parsedValues.success) {
      return NextResponse.json({
        error: parsedValues.error?.issues[0].message,
      });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' });
    }

    let uploadImagesResult;
    let uploadVideoResult;

    if (data.images && data.images.length > 0) {
      try {
        uploadImagesResult = await Promise.all(
          data.images.map(async (image: File) => {
            return fileUpload(image);
          }),
        );
        console.log('FILE UPLOAD:', uploadImagesResult);

        const hasError = uploadImagesResult.some(
          (result) => result instanceof Error,
        );

        if (hasError) {
          return NextResponse.json({
            error: 'Ошибка при загрузке файлов',
          });
        }

        uploadImagesResult = uploadImagesResult.filter(
          (result) => typeof result === 'string',
        );
      } catch (error) {
        return NextResponse.json({ error: 'Ошибка при загрузке файлов' });
      }
    }

    if (data.video) {
      uploadVideoResult = await fileUpload(data.video);

      if (uploadVideoResult instanceof Error) {
        return NextResponse.json({ error: uploadVideoResult.message });
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

    return NextResponse.json({ success: 'Урок успешно добавлен' });
  } catch (error) {
    throw error;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();

    const images = formData.getAll('images');
    const values: { [key: string]: FormDataEntryValue | FormDataEntryValue[] } =
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

    const { data, ...parsedValues } = await editLessonSchema.safeParse(values);

    if (!parsedValues.success) {
      return NextResponse.json({ error: parsedValues.error.issues[0].message });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' });
    }

    let uploadImagesResult;
    let uploadVideoResult;

    if (data.images && data.images.length > 0) {
      try {
        uploadImagesResult = await Promise.all(
          data.images.map(async (image: File) => {
            return fileUpload(image);
          }),
        );
        console.log('FILE UPLOAD:', uploadImagesResult);

        const hasError = uploadImagesResult.some(
          (result) => result instanceof Error,
        );

        if (hasError) {
          return NextResponse.json({
            error: 'Ошибка при загрузке файлов',
          });
        }

        uploadImagesResult = uploadImagesResult.filter(
          (result) => typeof result === 'string',
        );
      } catch (error) {
        return NextResponse.json({ error: 'Ошибка при загрузке файлов' });
      }
    }

    if (data.video) {
      uploadVideoResult = await fileUpload(data.video);

      if (uploadVideoResult instanceof Error) {
        return NextResponse.json({ error: uploadVideoResult.message });
      }
    }

    const updatedData = {
      name: data.name || existingLesson.name,
      content: data.content || existingLesson.content,
      images: uploadImagesResult || existingLesson.images,
      video: uploadVideoResult || existingLesson.video,
      courseId: data.courseId || existingLesson.courseId,
    };

    console.log('LESSON ROUTE: ', updatedData);

    await prisma.lesson.update({
      where: { id: lessonId as string },
      data: updatedData,
    });

    return NextResponse.json({ success: 'Урок успешно изменен' });
  } catch (error) {
    throw error;
  }
}
