import ExerciseForm from '@/app/components/exercise-form';
import ExerciseFormWrapper from '@/app/components/exercise-form-wrapper';
import LessonCard from '@/app/components/lesson-card';
import { getLessonByName } from '@/app/libs/utils/lessons';

export default async function Lesson({ params }: { params: { lesson: string } }) {
  const lesson = await getLessonByName(params.lesson);

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{params.lesson}</h1>
      <ExerciseForm lessonId={lesson?.id} mode="create" />
      {lesson && <LessonCard lesson={lesson} exercise={lesson.exercise} />}
      <div className="flex w-full gap-10 p-5">
        <div className="w-2/4"></div>
        <div className="w-2/4">{lesson?.exercise?.id && <ExerciseFormWrapper exerciseId={lesson?.exercise?.id} />}</div>
      </div>
    </>
  );
}
