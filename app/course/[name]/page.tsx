import LessonForm from '@/app/components/LessonForm';
import { getAllLessons, getCourseByName } from '@/app/libs/utils';
import Link from 'next/link';

export default async function Course({ params }: { params: { name: string } }) {
  const course = await getCourseByName(params.name);
  const lessons = await getAllLessons();

  return (
    <>
      <h1>Course: {params.name}</h1>
      <Link href={`${params.name}/tags`}>Tags</Link>
      <br />
      <Link href={`${params.name}/flex`}>Flex</Link>
      <LessonForm courseId={course?.id} />
      {lessons.length > 0 &&
        lessons.map((lesson) => (
          <Link key={lesson.id} href={`/course/${params.name}/${lesson.name}`}>
            {lesson.name}
          </Link>
        ))}
    </>
  );
}
