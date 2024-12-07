import { fileUpload } from '@/app/libs/utils/auth';
import { lessonSchema } from '@/app/libs/validation';
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

    console.log('LESSON ROUTE: ', values);

    const { data, ...parsedValues } = lessonSchema.safeParse(values);

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

    return NextResponse.json({ success: 'Lesson successfully added' });
  } catch (error) {
    throw error;
  }
}
