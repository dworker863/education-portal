'use client';

import { FC, useContext } from 'react';
import { cn } from '../libs/cn';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './button';
import { MdModeEditOutline } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { ModalContext } from './app-wrapper';
import Link from 'next/link';
import slugify from 'slugify';
import { isObjectSubscription } from '../libs/utils/common';

type TProfile = {
  mode: 'component' | 'page';
  showProfile?: boolean;
};

const Profile: FC<TProfile> = ({ mode, showProfile }) => {
  const modalContext = useContext(ModalContext);
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const prizeTickets = session?.data?.user?.prizeTickets;

  const completedCourses = user?.coursesProgress?.filter((course) => course.completedAt);

  if (!user) {
    return null;
  }

  return (
    <div
      className={cn(
        ' flex flex-col ',
        {
          'absolute top-0 right-[-400px] -z-10 w-[400px] h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform':
            mode === 'component',
        },
        { '-translate-x-[400px]': showProfile },
      )}
    >
      <div className="mb-10">
        <div className="flex gap-8 ">
          <div className="w-20 ml-[10px] rounded-full overflow-hidden">
            {user?.image && <Image src={user?.image?.replace(/\\/gi, '/')} alt="avatar" width={100} height={100} />}
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-customAccent">{user?.name}</p>
            <p className="max-w-36 text-xs">{user?.email}</p>
          </div>
        </div>
        <Button
          className="mt-4"
          variant="custom"
          onClick={() => {
            modalContext?.setIsModalOpen(true);
            router.push(`/edit-profile?email=${user?.email}&type=image`);
          }}
        >
          Изменить
        </Button>
      </div>
      <div>
        <h2 className="mb-4 text-customSecondary">Инфо</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-0">
            {user?.firstName && (
              <div className="flex items-center">
                <p className="text-sm">
                  Имя: <span className="text-customAccent">{user?.firstName}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    modalContext?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&field=firstName`);
                  }}
                >
                  <MdModeEditOutline className="text-customSecondary hover:scale-125" size={20} />
                </Button>
              </div>
            )}
            {user?.lastName && (
              <div className="flex items-center">
                <p className="text-sm">
                  Фамилия: <span className="text-customAccent ">{user?.lastName}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    modalContext?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&field=lastName`);
                  }}
                >
                  <MdModeEditOutline className="hover:scale-125" size={20} />
                </Button>
              </div>
            )}
            {user?.birthDate && (
              <div className="flex items-center">
                <p className="text-sm">
                  Дата рождения:
                  <span className="text-customAccent">{new Date(user?.birthDate).toLocaleDateString()}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    modalContext?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&type=birthDate`);
                  }}
                >
                  <MdModeEditOutline className="text-customSecondary hover:scale-125" size={20} />
                </Button>
              </div>
            )}
          </div>
          <p className="mb-2 text-sm">
            Уровень: <span className="text-customAccent">{user?.rank}</span>
          </p>
          <p className="mb-2 text-sm">
            Рейтинг: <span className="text-customAccent">{user?.rating}</span>
          </p>
          {user?.coursesProgress && user?.coursesProgress.length > 0 && (
            <div className="mb-2 text-sm">
              Изучаемые курсы:
              {user?.coursesProgress.map((courseProgress, index) => {
                const lessonName =
                  courseProgress?.currentLesson?.name && slugify(courseProgress?.currentLesson.name, { locale: 'ru' });
                return (
                  <div
                    className="flex flex-col mb-4"
                    key={courseProgress.course?.name ? courseProgress.course?.name + index : index}
                  >
                    <Link href={`/courses/${courseProgress.course?.name}`}>
                      <span className="ml-1 text-customAccent hover:text-customBackground ">
                        {courseProgress.course?.name && courseProgress.course?.name}
                        <span className="text-customSecondary"> ({courseProgress.progress}% )</span>
                      </span>
                    </Link>
                    {courseProgress?.currentLesson && (
                      <Link href={`/courses/${courseProgress.course?.name}/${lessonName}`}>
                        <span className="text-customAccent hover:text-customBackground">
                          {courseProgress?.currentLesson.name}
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {completedCourses && completedCourses.length > 0 && (
            <p className="mb-2 text-sm">
              Завершенные курсы:
              {completedCourses.map((courseProgress, index) => (
                <span key={courseProgress.id + index} className="text-customAccent">
                  {courseProgress.course?.name}
                </span>
              ))}
            </p>
          )}
          {user?.achievementsProgress && user?.achievementsProgress.length > 0 && (
            <div className="mb-2 text-sm">
              Прогресс достижений:
              {user?.achievementsProgress.map((achievementProgress, index) => {
                // if (achievementProgress.progress < 100) {
                return (
                  <div
                    className="flex flex-col mb-4"
                    key={achievementProgress.achievement?.name ? achievementProgress.achievement?.name + index : index}
                  >
                    <Link href={`/achievements/${achievementProgress.achievement?.name}`}>
                      <span className="ml-1 text-customAccent hover:text-customBackground ">
                        {achievementProgress.achievement?.name && achievementProgress.achievement?.name}
                        <span className="text-customSecondary"> ({achievementProgress.progress}% )</span>
                      </span>
                    </Link>
                  </div>
                );
                // }
              })}
            </div>
          )}
          {prizeTickets && prizeTickets.length > 0 && (
            <div className="mb-2 text-sm">
              Призовые билеты:
              {prizeTickets.map((prizeTicket, index) => {
                return (
                  <div className="flex flex-col mb-4" key={prizeTicket.id ? prizeTicket.id + index : index}>
                    <Link href={`/achievements/${prizeTicket.name}`}>
                      <span className="ml-1 text-customAccent hover:text-customBackground ">
                        {prizeTicket.name}
                        {prizeTicket.percent && (
                          <span className="text-customSecondary"> ({prizeTicket.percent}% )</span>
                        )}
                        {prizeTicket.months && (
                          <span className="text-customSecondary"> ({prizeTicket.months} мес. )</span>
                        )}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mb-2 text-sm">
            Баланс: <span className="text-customAccent">{user?.moneyUSD}</span>
          </div>
          <div className="mb-2 text-sm">
            {user?.subscription &&
              isObjectSubscription(user?.subscription) &&
              user?.subscription.validUntil > new Date() && (
                <>
                  <span className="text-customAccent">
                    Подписка активна до {user?.subscription.validUntil.toLocaleDateString()}{' '}
                  </span>
                  <Button variant="customLink">Продлить подписку</Button>
                </>
              )}
            {(!user?.subscription ||
              (isObjectSubscription(user?.subscription) && user?.subscription.validUntil < new Date())) && (
              <Button
                className="mt-4"
                variant="custom"
                onClick={() => {
                  router.push(`/subscribe`);
                }}
              >
                Оформить подписку
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
