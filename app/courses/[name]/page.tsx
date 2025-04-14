import Lessons from '@/app/components/lessons';
import { getCourseByName } from '@/app/libs/utils/courses';

export default async function Course({ params }: { params: { name: string } }) {
  const course = await getCourseByName(params.name);

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{params.name}</h1>
      <Lessons courseId={course?.id} lessons={course?.lessons} params={params} />
    </>
  );
}
