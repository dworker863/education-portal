import LessonForm from '@/app/components/LessonForm';
import { getCourseByName } from '@/app/libs/utils';
import Link from 'next/link';

export default async function Course({ params }: { params: { name: string } }) {
  const course = await getCourseByName(params.name);

  return (
    <>
      <h1>Course: {params.name}</h1>
      <Link href={`${params.name}/tags`}>Tags</Link>
      <br />
      <Link href={`${params.name}/flex`}>Flex</Link>
      <LessonForm courseId={course?.id} />
    </>
  );
}
