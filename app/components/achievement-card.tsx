import React, { FC } from 'react';
import { IAchievement } from '../libs/interfaces/interfaces';
import Link from 'next/link';
import Image from 'next/image';

type TAchievementCardProps = {
  achievement: IAchievement;
};

const AchievementCard: FC<TAchievementCardProps> = ({ achievement }) => {
  return (
    <Link href={`/achievements/${achievement.name}`}>
      <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-primary">
        <h2 className="mb-5 text-center text-xl uppercase">{achievement.name}</h2>
        <div className="flex gap-10 mb-8">
          <div className="w-[300px] flex-shrink-0">
            {achievement.icon && (
              <Image src={achievement.icon.replace(/\\/gi, '/')} alt="icon" width={300} height={300} />
            )}
          </div>
          <div className="flex-grow space-y-4">
            <h2 className="text-customSecondary">Описание</h2>
            <p>{achievement.description}</p>
            <h2 className="text-customSecondary">Сроки</h2>
            <p>
              Дата начала:
              <span className="text-customPrimary"> {achievement.startDate.toLocaleString()}</span>
            </p>
            <p>
              Дата окончания:
              <span className="text-customPrimary"> {achievement.endDate?.toLocaleString()}</span>
            </p>
            <h2 className="mb-4 text-customSecondary">Условия</h2>
            {typeof achievement.criteria === 'object' && !Array.isArray(achievement.criteria) && (
              <p>
                Тип: <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.type)}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          {typeof achievement.reward === 'object' &&
            !Array.isArray(achievement.reward) &&
            achievement.reward?.amount && (
              <span className="text-customSecondary text-lg font-semibold">
                {JSON.stringify(achievement.reward.amount)}
              </span>
            )}
        </div>
      </div>
    </Link>
  );
};

export default AchievementCard;
