import Editor from '@/app/components/Editor';
import ExerciseForm from '@/app/components/ExerciseForm';
import LessonCard from '@/app/components/LessonCard';
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
