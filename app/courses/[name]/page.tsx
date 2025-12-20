import Lessons from '@/app/components/lessons';
import { getCourseByName } from '@/app/libs/utils/courses';
import CyrillicToTranslit from 'cyrillic-to-translit-js';

export default async function CoursePage({
  params,
}: {
  params: { name: string };
}) {
  // @ts-ignore
  const cyrillicToTranslit = new CyrillicToTranslit();
  const courseName = cyrillicToTranslit
    .reverse(params.name)
    .replaceAll('-', ' ');
  const course = await getCourseByName(params.name);
  // const lessons = await getPartialLessons();

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{courseName}</h1>
      <Lessons
        courseId={course?.id}
        lessons={course?.lessons}
        name={params.name}
      />
    </>
  );
}
