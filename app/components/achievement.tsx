import React, { FC } from 'react';
import { IAchievement } from '../libs/interfaces/interfaces';
import AchievementFormWrapper from './achievement-form-wrapper';

type TAchievementProps = {
  achievement: IAchievement;
};

const Achievement: FC<TAchievementProps> = ({ achievement }) => {
  return (
    <>
      <h2 className="mb-5 text-center">{achievement.name}</h2>
      <p className="mb-5">{achievement.icon}</p>
      <p className="mb-5">{achievement.task}</p>
      <p className="mb-5">{achievement.language}</p>
      <p>
        Необходимый Уровень: <span className="text-customSecondary font-semibold">{achievement?.requiredRank}</span>
      </p>
      <p className="mb-5">
        Скидка: <span className="text-customSecondary font-semibold">{achievement?.discount}%</span>
      </p>
      <p className="mb-5">
        Курс: <span className="text-customSecondary font-semibold">{achievement?.course?.name}</span>
      </p>
      <AchievementFormWrapper achievementId={achievement.id} />
    </>
  );
};

export default Achievement;
