import { lessonSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('LESSON ENDPOINT');

  try {
    const values = await request.json();
    const { data, ...parsedValues } = await lessonSchema.safeParse(values);

    if (!parsedValues.success) {
      return NextResponse.json({
        error: parsedValues.error?.issues[0].message,
      });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' });
    }

    await prisma.lesson.create({
      data: {
        name: data.name,
        content: data.content,
        images: data.images,
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
