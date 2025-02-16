'use client';

import { FC } from 'react';
import { cn } from '../libs/cn';
import AchievementForm from './achievement-form';
import AchievementFormWrapper from './achievement-form-wrapper';
import { IAchievement } from '../libs/interfaces/interfaces';

type TAchievementsProps = {
  showAchievements: boolean;
  achievements: IAchievement[];
};

const Achievements: FC<TAchievementsProps> = ({ showAchievements, achievements }) => {
  return (
    <div
      className={cn(
        'absolute top-0 right-[-600px] -z-10 flex flex-col w-[600px] h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-[600px]': showAchievements },
      )}
    >
      <h2 className="text-customSecondary">Achievements</h2>
      <section className="py-5">
        <AchievementForm mode="create" />
        <section>
          {achievements.length > 0 &&
            achievements.map((achievement) => (
              <div key={achievement.id}>
                <AchievementFormWrapper achievementId={achievement.id} />
              </div>
            ))}
          <br />
        </section>
      </section>
    </div>
  );
};

export default Achievements;
