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
      <AchievementCard achievement={achievement} />
      <AchievementFormWrapper achievementId={achievement.id} />
    </>
  );
};

export default Achievement;
