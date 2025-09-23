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
      <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-customBlock">
        <h2 className="mb-5 text-center text-xl uppercase">{achievement.name}</h2>
        <div className="flex gap-10">
          <div className="w-[300px] flex-shrink-0">
            {achievement.icon && (
              <Image src={achievement.icon.replace(/\\/gi, '/')} alt="icon" width={300} height={300} />
            )}
          </div>
          <div className="flex-grow space-y-4">
            <h2 className="text-customAccent">Описание</h2>
            <p>{achievement.description}</p>
            <h2 className="text-customAccent">Сроки</h2>
            <div className="space-y-2">
              <p>
                Дата начала:
                <span className="text-customTextAccent"> {achievement.startDate.toLocaleString()}</span>
              </p>
              <p>
                Дата окончания:
                <span className="text-customTextAccent"> {achievement.endDate?.toLocaleString()}</span>
              </p>
            </div>
            <h2 className="mb-4 text-customAccent">Условия</h2>

            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              achievement.criteria?.type === 'EXERCISE_COMPLETION' && (
                <div className="space-y-2">
                  <p>
                    Тип: <span className="text-customTextAccent">Выполнение упражнений</span>
                  </p>
                  {achievement.criteria?.count && (
                    <p>
                      Количество упражнений:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.count)}</span>
                    </p>
                  )}
                  {achievement.criteria?.language && (
                    <p>
                      Язык программирования:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                  {achievement.criteria?.pointsToComplete && (
                    <p>
                      Необходимое количество баллов:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.prizePoints)}</span>
                    </p>
                  )}
                  {achievement.criteria?.requiredRank && (
                    <p>
                      Необходимый рейтинг:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                </div>
              )}
            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              (achievement.criteria?.type === 'COURSE_COMPLETION' ||
                achievement.criteria?.type === 'COURSE_REGISTRATION') && (
                <div className="space-y-2">
                  <p>
                    Тип:{' '}
                    <span className="text-customTextAccent">
                      {achievement.criteria?.type === 'COURSE_COMPLETION' ? 'Завершение курса' : 'Регистрация на курсе'}
                    </span>
                  </p>
                  {achievement.criteria?.courseIds &&
                    Array.isArray(achievement.criteria?.courseIds) &&
                    achievement.criteria?.courseIds.length > 0 &&
                    achievement.criteria?.courseIds.map((courseId, index) => (
                      <p key={JSON.stringify(courseId) + index}>
                        Допустимые курсы: <span className="text-customTextAccent">{JSON.stringify(courseId)}</span>
                      </p>
                    ))}
                  {achievement.criteria?.minPrice && (
                    <p>
                      Минимальная цена курса:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.minPrice)}</span>
                    </p>
                  )}
                  {achievement.criteria?.maxPrice && (
                    <p>
                      Максимальная цена курса:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.maxPrice)}</span>
                    </p>
                  )}
                  {achievement.criteria?.requiredRank && (
                    <p>
                      Необходимый рейтинг:{' '}
                      <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.language)}</span>
                    </p>
                  )}
                </div>
              )}

            {typeof achievement.criteria === 'object' &&
              !Array.isArray(achievement.criteria) &&
              achievement.criteria?.type === 'SUBSCRIPTION' && (
                <div className="space-y-2">
                  <p>
                    Тип: <span className="text-customTextAccent">Оформление подписки</span>
                  </p>
                  <p>
                    Продолжительность подписки:{' '}
                    <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.duration)}</span>
                  </p>
                  <p>
                    Количество месяцев/лет:{' '}
                    <span className="text-customTextAccent">{JSON.stringify(achievement.criteria?.amount)}</span>
                  </p>
                  <p>
                    Только для первой подписки:{' '}
                    <span className="text-customTextAccent">
                      {JSON.stringify(achievement.criteria?.firstTimeOnly) ? 'Да' : 'Нет'}
                    </span>
                  </p>
                </div>
              )}
            {typeof achievement.reward === 'object' && !Array.isArray(achievement.reward) && achievement.reward && (
              <div className="flex justify-between pt-8">
                <span className="text-customAccent text-lg font-semibold">
                  {JSON.stringify(achievement.reward.type)}
                </span>
                {achievement.reward.subscriptionType && (
                  <span className="text-customAccent text-lg font-semibold">
                    {JSON.stringify(achievement.reward.subscriptionType)}
                  </span>
                )}
                <span className="text-customAccent text-lg font-semibold">
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
