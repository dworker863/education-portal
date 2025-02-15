import { FC } from 'react';
import { cn } from '../libs/cn';
import AchievementsForm from './achievements-form';

type TAchievementsProps = {
  showAchievements: boolean;
};

const Achievements: FC<TAchievementsProps> = ({ showAchievements }) => {
  return (
    <div
      className={cn(
        'absolute top-0 right-[-600px] -z-10 flex flex-col w-[600px] h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-[600px]': showAchievements },
      )}
    >
      <h2 className="text-customSecondary">Achievements</h2>
      <AchievementsForm />
    </div>
  );
};

export default Achievements;
