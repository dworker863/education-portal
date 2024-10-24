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

    let uploadResult;

    if (data.images) {
      uploadResult = await fileUpload(data.images);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message });
      }
    }

    await prisma.lesson.create({
      data: {
        name: data.name,
        content: data.content,
        images: uploadResult,
        video: data.video,
        exerciseId: 'test',
        courseId: 'test',
      },
    });

    return NextResponse.json({ success: 'Lesson successfully added' });
  } catch (error) {
    console.log(error);
  }
}
