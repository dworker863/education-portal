'use client';

import { useContext } from 'react';
import ExerciseForm from '../components/exercise-form';
import Exercises from '../components/exercises';
import { ExercisesContext } from '../components/app-wrapper';

export default function ExercisesPage() {
  const exercises = useContext(ExercisesContext);

  return (
    <>
      <h1 className="mb-5">Exercises</h1>
      <ExerciseForm mode="create" />
      {exercises && <Exercises mode="page" exercises={exercises} />}
    </>
  );
}
