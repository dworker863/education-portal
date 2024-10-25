import { fileUpload } from '@/app/libs/utils';
import { lessonSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('LESSON ENDPOINT');

  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());
    console.log(values);

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

    if (data.images) {
      uploadImagesResult = await fileUpload(data.images);

      if (uploadImagesResult instanceof Error) {
        return NextResponse.json({ error: uploadImagesResult.message });
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
        images: uploadImagesResult,
        video: uploadVideoResult,
        exerciseId: 'test',
        courseId: 'test',
      },
    });

    return NextResponse.json({ success: 'Lesson successfully added' });
  } catch (error) {
    console.log(error);
  }
}
