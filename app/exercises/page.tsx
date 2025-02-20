import ExerciseForm from '../components/exercise-form';
import Exercises from '../components/exercises';
import { getAllExercises } from '../libs/server-actions/exercises-actions';

export default async function Profile() {
  const exercises = await getAllExercises();

  return (
    <>
      <h1 className="mb-5">Exercises</h1>
      <ExerciseForm mode="create" />
      <Exercises mode="page" exercises={exercises} />
    </>
  );
}
