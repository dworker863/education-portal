import { prisma } from '@/prisma/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('LESSON ENDPOINT');

  console.log(request);

  try {
    const data = await request.json();
    console.log(data);

    // const lesson = await prisma.lesson.create({});
  } catch (error) {
    console.log(error);
  }
}
