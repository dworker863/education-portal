import ErrorMessage from '@/app/components/error-message';
import ExerciseWrapper from '@/app/components/exercise-wrapper';
import { getExerciseById } from '@/app/libs/utils/exercises';
import React from 'react';

const ExercisePage = async ({ params }: { params: { name: string } }) => {
  if (!params.name) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Неверный URL" />
      </div>
    );
  }

  const slugParts = params.name.split('-');
  const id = slugParts.pop()!;
  const exercise = await getExerciseById(id);

  if (!exercise) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Упражнение не найдено" />
      </div>
    );
  }

  return <div>{exercise && <ExerciseWrapper exercise={exercise} />}</div>;
};

export default ExercisePage;
