import LessonForm from '@/app/components/LessonForm';
import Link from 'next/link';

export default function Course({ params }: { params: { name: string } }) {
  return (
    <>
      <h1>Course: {params.name}</h1>
      <Link href={`${params.name}/tags`}>Tags</Link>
      <br />
      <Link href={`${params.name}/flex`}>Flex</Link>
      <LessonForm />
    </>
  );
}
