import { prisma } from '@/prisma/prisma';

export async function POST(request: Request) {
  try {
    const data = request.body;
    console.log(data);

    // const lesson = await prisma.lesson.create({});
  } catch (error) {
    console.log(error);
  }
}
