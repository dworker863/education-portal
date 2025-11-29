import { typesense } from '@/app/libs/search-engine/typesense';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') ?? '';

    if (!query)
      return NextResponse.json({ courses: [], exercises: [], tags: [] });

    const [courses, exercises] = await Promise.all([
      typesense.collections('courses').documents().search({
        q: query,
        prefix: true,
        per_page: 10,
        query_by: 'name,description,tags',
      }),
      typesense.collections('exercises').documents().search({
        q: query,
        prefix: true,
        per_page: 10,
        query_by: 'name,task,language,tags',
      }),
    ]);

    const courseIds =
      courses.hits?.map((hit) => (hit.document as { id: string }).id) || [];
    const exerciseIds =
      exercises.hits?.map((hit) => (hit.document as { id: string }).id) || [];

    const searchedCourses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
    });

    const searchedExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
    });

    return NextResponse.json({
      courses: searchedCourses || [],
      exercises: searchedExercises || [],
    });
  } catch (error) {
    console.error('Ошибка при обработке поиска:', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}
