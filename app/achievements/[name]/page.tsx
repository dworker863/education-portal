import Achievement from '@/app/components/achievement';
import { getAchievementByName } from '@/app/libs/server-actions/achievements-actions';
import React from 'react';

const AchievementPage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  const achievement = await getAchievementByName(title);

  console.log('ACHIEVEMENT PAGE: ', JSON.stringify(achievement?.reward));

  return <div>{achievement && <Achievement achievement={achievement} />}</div>;
};

export default AchievementPage;
