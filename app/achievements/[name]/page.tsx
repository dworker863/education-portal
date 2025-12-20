import Achievement from '@/app/components/achievement';
import ErrorMessage from '@/app/components/error-message';
import { getAchievementById } from '@/app/libs/utils/achievements';
import React from 'react';

const AchievementPage = async ({ params }: { params: { name: string } }) => {
  if (!params.name) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Неверный URL" />
      </div>
    );
  }

  const slugParts = params.name.split('-');
  const id = slugParts.pop()!;
  const achievement = await getAchievementById(id);

  if (!achievement) {
    return (
      <div className="flex justify-center items-center">
        <ErrorMessage message="Достижение не найдено" />
      </div>
    );
  }
  // const title = name.replace(/([A-Z])/g, '$1').trim();

  return <div>{achievement && <Achievement achievement={achievement} />}</div>;
};

export default AchievementPage;
