import ExerciseForm from '@/app/components/exercise-form';
import ExerciseFormWrapper from '@/app/components/exercise-form-wrapper';
import LessonCard from '@/app/components/lesson-card';
import TestForm from '@/app/components/test-form';
import TestFormWrapper from '@/app/components/test-form-wrapper';
import { getLessonByName } from '@/app/libs/utils/lessons';
import CyrillicToTranslit from 'cyrillic-to-translit-js';

export default async function Lesson({ params }: { params: { lesson: string } }) {
  // @ts-ignore
  const cyrillicToTranslit = new CyrillicToTranslit();
  const lessonName = cyrillicToTranslit.reverse(params.lesson).replace('-', ' ');
  const lesson = await getLessonByName(lessonName);

  return (
    <>
      <h1 className="mb-5 text-center text-xl uppercase">{lessonName}</h1>
      <ExerciseForm lessonId={lesson?.id} mode="create" />
      <TestForm lessonId={lesson?.id} mode="create" />
      {lesson && <LessonCard lesson={lesson} exercises={lesson.exercises} tests={lesson.tests} />}
    </>
  );
}
