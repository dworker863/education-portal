import ExerciseWrapper from '@/app/components/exercise-wrapper';
import { getExerciseByName } from '@/app/libs/utils/exercises';
import React from 'react';

const ExercisePage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const exercise = await getExerciseByName(name);

  console.log('ExercisePage exercise:', name, exercise);

  return <div>{exercise && <ExerciseWrapper exercise={exercise} />}</div>;
};

export default ExercisePage;
