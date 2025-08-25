import Achievement from '@/app/components/achievement';
import { getAchievementByName } from '@/app/libs/utils/achievements';
import React from 'react';

const AchievementPage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const title = name.replace(/([A-Z])/g, ' $1').trim();
  const achievement = await getAchievementByName(title);

  return <div>{achievement && <Achievement achievement={achievement} />}</div>;
};

export default AchievementPage;
