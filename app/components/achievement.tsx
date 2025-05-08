import React, { FC } from 'react';
import { IAchievement } from '../libs/interfaces/interfaces';
import AchievementFormWrapper from './achievement-form-wrapper';
import AchievementCard from './achievement-card';

type TAchievementProps = {
  achievement: IAchievement;
};

const Achievement: FC<TAchievementProps> = ({ achievement }) => {
  return (
    <>
      <h2 className="mb-5 text-center">{achievement.name}</h2>
      <p className="mb-5">{achievement.icon}</p>
      <p className="mb-5">{achievement.description}</p>
      {/* {achievement.criteria.map(anfn)} */}
      <p className="mb-5">Дата начала: {new Date(achievement.startDate).toLocaleDateString()}</p>
      <p className="mb-5">Дата окончания: {new Date(achievement.startDate).toLocaleDateString()}</p>
      <AchievementCard achievement={achievement} />
      <AchievementFormWrapper achievementId={achievement.id} />
    </>
  );
};

export default Achievement;
