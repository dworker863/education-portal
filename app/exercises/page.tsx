import Exercises from '../components/exercises';
import { getAllExercises } from '../libs/server-actions/exercises-actions';

export default async function Profile() {
  const exercises = await getAllExercises();
  return <div>{exercises && exercises?.length > 0 && <Exercises exercises={exercises} mode="page" />}</div>;
}
