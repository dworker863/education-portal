import ErrorMessage from '@/app/components/error-message';
import Lessons from '@/app/components/lessons';
import { getCourseWithLessonsById } from '@/app/libs/utils/courses';

export default async function CoursePage({
  params,
}: {
  params: { name: string };
}) {
  if (!params.name) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Неверный URL" />
      </div>
    );
  }

  const slugParts = params.name.split('-');
  const id = slugParts.pop()!; // получаем ID
  const course = await getCourseWithLessonsById(id);

  if (!course) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Курс не найден" />
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{course.name}</h1>
      <Lessons
        courseId={course?.id}
        lessons={course.lessons}
        name={course?.name}
      />
    </>
  );
}
