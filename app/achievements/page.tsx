'use client';

import { useContext } from 'react';
import AchievementForm from '../components/achievement-form';
import Achievements from '../components/achievements';
import { AchievementsContext } from '../components/app-wrapper';

export default function AchievementsPage() {
  const achievements = useContext(AchievementsContext);

  return (
    <>
      <h1 className="mb-5">Achievements</h1>
      <AchievementForm mode="create" />
      {achievements && <Achievements mode="page" achievements={achievements} />}
    </>
  );
}
