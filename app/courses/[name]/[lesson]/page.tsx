import ErrorMessage from '@/app/components/error-message';
import ExerciseForm from '@/app/components/exercise-form';
import LessonCard from '@/app/components/lesson-card';
import TestForm from '@/app/components/test-form';
import {
  getLessonWithExercisesById,
  getPartialLessons,
} from '@/app/libs/utils/lessons';

export default async function LessonPage({
  params,
}: {
  params: { lesson: string };
}) {
  if (!params.lesson) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Неверный URL" />
      </div>
    );
  }
  const slugParts = params.lesson.split('-');
  const id = slugParts.pop()!; // получаем ID
  console.log('LessonPage id:', id);
  const lesson = await getLessonWithExercisesById(id);
  const lessons = await getPartialLessons();

  if (!lesson) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Урок не найден" />
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{lesson.name}</h1>
      <ExerciseForm lessonId={lesson?.id} mode="create" />
      <TestForm lessonId={lesson?.id} mode="create" />
      {lesson && (
        <LessonCard
          lesson={lesson}
          exercises={lesson.exercises}
          tests={lesson.tests}
          lessons={lessons}
        />
      )}
    </>
  );
}
