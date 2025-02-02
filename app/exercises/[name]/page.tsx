import Exercise from '@/app/components/exercise';
import { getExerciseByName } from '@/app/libs/utils/exercises';
import React from 'react';

const ExercisePage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  const exercise = await getExerciseByName(title);

  return <div>{exercise && <Exercise exercise={exercise} />}</div>;
};

export default ExercisePage;
