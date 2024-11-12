import { fileUpload } from '@/app/libs/utils/auth';
import { courseSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const { data, ...parsedValues } = await courseSchema.safeParse(values);

    if (!parsedValues.success) {
      console.log(parsedValues);

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
        icon: uploadResult,
        priceUSD: Number(data.priceUSD),
        certificateId: 'test',
        completedUsersCount: 0,
        category: data.category,
      },
    });

    return NextResponse.json({ success: 'Course successfully added' });
  } catch (error) {
    console.log(error);
  }
}
