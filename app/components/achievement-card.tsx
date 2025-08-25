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
        <div className="flex gap-10">
          <div className="w-[300px] flex-shrink-0">
            {achievement.icon && (
              <Image src={achievement.icon.replace(/\\/gi, '/')} alt="icon" width={300} height={300} />
            )}
          </div>
          <div className="flex-grow space-y-4">
            <h2 className="text-customSecondary">Описание</h2>
            <p>{achievement.description}</p>
            <h2 className="text-customSecondary">Сроки</h2>
            <div className="space-y-2">
              <p>
                Дата начала:
                <span className="text-customPrimary"> {achievement.startDate.toLocaleString()}</span>
              </p>
              <p>
                Дата окончания:
                <span className="text-customPrimary"> {achievement.endDate?.toLocaleString()}</span>
              </p>
            </div>
            <h2 className="mb-4 text-customSecondary">Условия</h2>
            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              achievement.criteria?.type === 'COMBINATION' && (
                <div className="space-y-2">
                  <p>
                    Тип: <span className="text-customPrimary">Комбинированное достижение</span>
                  </p>
                  <p>
                    Оба условия:{' '}
                    <span className="text-customPrimary">
                      {JSON.stringify(achievement.criteria?.operator) === 'AND' ? 'Да' : 'Нет'}
                    </span>
                  </p>
                  {achievement.criteria?.requiredRank && (
                    <p>
                      Необходимый рейтинг:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                </div>
              )}
            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              (achievement.criteria?.type === 'EXERCISE_COMPLETION' ||
                (achievement.criteria?.type === 'COMBINATION' &&
                  achievement.criteria?.conditions &&
                  Array.isArray(achievement.criteria?.conditions) &&
                  achievement.criteria?.conditions.some(
                    (condition) =>
                      typeof condition === 'object' &&
                      !Array.isArray(condition) &&
                      condition?.type === 'EXERCISE_COMPLETION',
                  ))) && (
                <div className="space-y-2">
                  <p>
                    Тип: <span className="text-customPrimary">Выполнение упражнений</span>
                  </p>
                  {achievement.criteria?.count && (
                    <p>
                      Количество упражнений:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.count)}</span>
                    </p>
                  )}
                  {achievement.criteria?.language && (
                    <p>
                      Язык программирования:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                  {achievement.criteria?.pointsToComplete && (
                    <p>
                      Необходимое количество баллов:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.prizePoints)}</span>
                    </p>
                  )}
                  {achievement.criteria?.requiredRank && (
                    <p>
                      Необходимый рейтинг:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                </div>
              )}
            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              (achievement.criteria?.type === 'COURSE_COMPLETION' ||
                achievement.criteria?.type === 'COURSE_REGISTRATION' ||
                (achievement.criteria?.type === 'COMBINATION' &&
                  achievement.criteria?.conditions &&
                  Array.isArray(achievement.criteria?.conditions) &&
                  achievement.criteria?.conditions.some((condition) => {
                    return (
                      typeof condition === 'object' &&
                      !Array.isArray(condition) &&
                      (condition?.type === 'COURSE_COMPLETION' || condition?.type === 'COURSE_REGISTRATION')
                    );
                  }))) && (
                <div className="space-y-2">
                  <p>
                    Тип:{' '}
                    <span className="text-customPrimary">
                      {achievement.criteria?.type === 'COURSE_COMPLETION' ? 'Завершение курса' : 'Регистрация на курсе'}
                    </span>
                  </p>
                  {achievement.criteria?.courseIds &&
                    Array.isArray(achievement.criteria?.courseIds) &&
                    achievement.criteria?.courseIds.length > 0 &&
                    achievement.criteria?.courseIds.map((courseId, index) => (
                      <p key={JSON.stringify(courseId) + index}>
                        Допустимые курсы: <span className="text-customPrimary">{JSON.stringify(courseId)}</span>
                      </p>
                    ))}
                  {achievement.criteria?.minPrice && (
                    <p>
                      Минимальная цена курса:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.minPrice)}</span>
                    </p>
                  )}
                  {achievement.criteria?.maxPrice && (
                    <p>
                      Максимальная цена курса:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.maxPrice)}</span>
                    </p>
                  )}
                  {achievement.criteria?.requiredRank && (
                    <p>
                      Необходимый рейтинг:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                </div>
              )}

            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              (achievement.criteria?.type === 'PARTICIPATION_LIMIT' ||
                (achievement.criteria?.type === 'COMBINATION' &&
                  achievement.criteria?.conditions &&
                  Array.isArray(achievement.criteria?.conditions) &&
                  achievement.criteria?.conditions.some(
                    (condition) =>
                      typeof condition === 'object' &&
                      !Array.isArray(condition) &&
                      condition?.type === 'PARTICIPATION_LIMIT',
                  ))) && (
                <div className="space-y-2">
                  <p>
                    Тип: <span className="text-customPrimary">Попадение в число первых</span>
                  </p>
                  <p>
                    Необходимое количество победителей:{' '}
                    <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.maxParticipants)}</span>
                  </p>
                  <p>
                    Количество победителей:{' '}
                    <span className="text-customPrimary">
                      {JSON.stringify(achievement.criteria?.currentParticipants)}
                    </span>
                  </p>
                  {achievement.criteria?.requiredRank && (
                    <p>
                      Необходимый рейтинг:{' '}
                      <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                </div>
              )}
            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              (achievement.criteria?.type === 'SUBSCRIPTION' ||
                (achievement.criteria?.type === 'COMBINATION' &&
                  achievement.criteria?.conditions &&
                  Array.isArray(achievement.criteria?.conditions) &&
                  achievement.criteria?.conditions.some(
                    (condition) =>
                      typeof condition === 'object' && !Array.isArray(condition) && condition?.type === 'SUBSCRIPTION',
                  ))) && (
                <div className="space-y-2">
                  <p>
                    Тип: <span className="text-customPrimary">Оформление подписки</span>
                  </p>
                  <p>
                    Тип подписки:{' '}
                    <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.tier)}</span>
                  </p>
                  <p>
                    Продолжительность подписки:{' '}
                    <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.duration)}</span>
                  </p>
                  <p>
                    Количество месяцев/лет:{' '}
                    <span className="text-customPrimary">{JSON.stringify(achievement.criteria?.amount)}</span>
                  </p>
                  <p>
                    Только для первой подписки:{' '}
                    <span className="text-customPrimary">
                      {JSON.stringify(achievement.criteria?.firstTimeOnly) ? 'Да' : 'Нет'}
                    </span>
                  </p>
                </div>
              )}
            {typeof achievement.reward === 'object' && !Array.isArray(achievement.reward) && achievement.reward && (
              <div className="flex justify-between pt-8">
                <span className="text-customSecondary text-lg font-semibold">
                  {JSON.stringify(achievement.reward.type)}
                </span>
                {achievement.reward.subscriptionType && (
                  <span className="text-customSecondary text-lg font-semibold">
                    {JSON.stringify(achievement.reward.subscriptionType)}
                  </span>
                )}
                <span className="text-customSecondary text-lg font-semibold">
                  {JSON.stringify(achievement.reward.amount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AchievementCard;
