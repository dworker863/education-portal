import Lessons from '@/app/components/Lessons';
import { getCourseByName } from '@/app/libs/utils/courses';
import { getAllLessons } from '@/app/libs/utils/lessons';

export default async function Course({ params }: { params: { name: string } }) {
  const course = await getCourseByName(params.name);
  const lessons = await getAllLessons();

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{params.name}</h1>
      <Lessons courseId={course?.id} lessons={lessons} params={params} />
    </>
  );
}
