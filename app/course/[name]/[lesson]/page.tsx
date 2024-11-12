import ExerciseForm from '@/app/components/exercise-form';
import LessonCard from '@/app/components/lesson-card';
import { getLessonByName } from '@/app/libs/utils/lessons';

export default async function Lesson({
  params,
}: {
  params: { lesson: string };
}) {
  const lesson = await getLessonByName(params.lesson);

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{params.lesson}</h1>
      <ExerciseForm lessonId={lesson?.id} />
      <LessonCard lesson={lesson} />
    </>
  );
}
