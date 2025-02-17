import AchievementForm from '../components/achievement-form';
import Achievements from '../components/achievements';
import { getAllAchievements } from '../libs/server-actions/achievements-actions';

export default async function AchievementsPage() {
  const achievements = await getAllAchievements();

  return (
    <>
      <h1 className="mb-5">Achievements</h1>
      <AchievementForm mode="create" />
      <Achievements mode="page" achievements={achievements} />
    </>
  );
}
