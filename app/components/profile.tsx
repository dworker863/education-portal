'use client';

import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { cn } from '../libs/cn';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './button';
import { MdModeEditOutline } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { ConfirmationContext, ModalContext } from './app-wrapper';
import Link from 'next/link';
import slugify from 'slugify';
import { isObjectSubscription } from '../libs/utils/common';
import { subscribeUser } from '../libs/server-actions/subscribe';
import ScrollIndicator from './scroll-indicator';

type TProfile = {
  mode: 'component' | 'page';
  showProfile?: boolean;
};

const Profile: FC<TProfile> = ({ mode, showProfile }) => {
  const modalContext = useContext(ModalContext);
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const prizeTickets = session?.data?.user?.prizeTickets;
  const [isPending, setIsPending] = useState(false);

  const completedCourses = user?.coursesProgress?.filter((course) => course.completedAt);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        if (user) {
          if (confirmationContext?.modalType === 'usage' && confirmationContext.confirmation) {
            setIsPending(true);

            const { updatedUser } = await subscribeUser(user.id, confirmationContext?.amount, 0);

            await session.update({
              subscription: updatedUser.subscription,
            });

            setIsPending(false);
            confirmationContext?.setConfirmation(false);
            confirmationContext?.setModalType(null);
          }
        }
      } catch (error) {
        confirmationContext?.setModalType('notification');
        confirmationContext?.setNotificationModalText((error as Error).message);
        confirmationContext?.setIsModalOpen(true);
        setIsPending(false);
        confirmationContext?.setConfirmation(false);
      }
    };

    loadSubscription();
  }, [confirmationContext, user]);

  const subscribeClickHandler = useCallback(async () => {
    if (!user) {
      console.error('Пользователь не авторизован');
      return;
    }
    // if (user && user?.coursesProgress?.some((progress) => progress.courseId === course.id)) {
    //   router.push(`/courses/${course.name}`);
    //   return;
    // }

    if (user?.prizeTickets && user?.prizeTickets.length > 0) {
      confirmationContext?.setModalType('usage');
      confirmationContext?.setUsageModalTicketType('SUBSCRIPTION');
      confirmationContext?.setUsageModalText(
        'Если вы хотите использовать призовой билет, выберите билет из списка и подтвердите действие.',
      );
      confirmationContext?.setIsModalOpen(true);
      return;
    }

    router.push(`/subscribe`);
  }, [confirmationContext, user]);

  if (!user) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative flex flex-col h-full overflow-y-auto',
        {
          'fixed top-0 right-[-400px] -z-10 w-[400px] h-full px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform':
            mode === 'component',
        },
        { '-translate-x-[400px]': showProfile },
      )}
    >
      <ScrollIndicator />
      <div className="mb-10">
        <div className="flex gap-8 ">
          <div className="w-20 ml-[10px] rounded-full overflow-hidden">
            {user?.image && <Image src={user?.image?.replace(/\\/gi, '/')} alt="avatar" width={100} height={100} />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-sm text-customTextAccent">{user?.name}</p>
              <Button
                variant="customLink"
                size="icon"
                onClick={() => {
                  modalContext?.setIsModalOpen(true);
                  router.push(`/edit-profile?email=${user?.email}&field=name`);
                }}
              >
                <MdModeEditOutline className="text-customAccent hover:scale-125" size={20} />
              </Button>
            </div>
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
        <h2 className="mb-4 text-customAccent">Инфо</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-0">
            {user?.firstName && (
              <div className="flex items-center">
                <p className="text-sm">
                  Имя: <span className="text-customTextAccent">{user?.firstName}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    modalContext?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&field=firstName`);
                  }}
                >
                  <MdModeEditOutline className="text-customAccent hover:scale-125" size={20} />
                </Button>
              </div>
            )}
            {user?.lastName && (
              <div className="flex items-center">
                <p className="text-sm">
                  Фамилия: <span className="text-customTextAccent ">{user?.lastName}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    modalContext?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&field=lastName`);
                  }}
                >
                  <MdModeEditOutline className="text-customAccent hover:scale-125" size={20} />
                </Button>
              </div>
            )}
            {user?.birthDate && (
              <div className="flex items-center">
                <p className="text-sm">
                  Дата рождения:
                  <span className="text-customTextAccent">{new Date(user?.birthDate).toLocaleDateString()}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    modalContext?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&type=birthDate`);
                  }}
                >
                  <MdModeEditOutline className="text-customAccent hover:scale-125" size={20} />
                </Button>
              </div>
            )}
          </div>
          <p className="mb-2 text-sm">
            Уровень: <span className="text-customTextAccent">{user?.rank}</span>
          </p>
          <p className="mb-2 text-sm">
            Рейтинг: <span className="text-customTextAccent">{user?.rating}</span>
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
                      <span className="ml-1 text-customTextAccent hover:text-customBackground ">
                        {courseProgress.course?.name && courseProgress.course?.name}
                        <span className="text-customAccent"> ({courseProgress.progress}% )</span>
                      </span>
                    </Link>
                    {courseProgress?.currentLesson && (
                      <Link href={`/courses/${courseProgress.course?.name}/${lessonName}`}>
                        <span className="text-customTextAccent hover:text-customBackground">
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
                <span key={courseProgress.id + index} className="text-customTextAccent">
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
                      <span className="ml-1 text-customTextAccent hover:text-customBackground ">
                        {achievementProgress.achievement?.name && achievementProgress.achievement?.name}
                        <span className="text-customAccent"> ({achievementProgress.progress}% )</span>
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
                      <span className="ml-1 text-customTextAccent hover:text-customBackground ">
                        {prizeTicket.name}
                        {prizeTicket.percent && <span className="text-customAccent"> ({prizeTicket.percent}% )</span>}
                        {prizeTicket.months && <span className="text-customAccent"> ({prizeTicket.months} мес. )</span>}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mb-2 text-sm">
            Количество рефералов:{' '}
            <span
              className="text-customTextAccent cursor-pointer hover:underline"
              onClick={() => {
                console.log(user.referrals);
              }}
            >
              {user.referrals}
            </span>
          </div>
          <div className="mb-2 text-sm">
            Реферальная ссылка:{' '}
            <span
              className="text-customTextAccent cursor-pointer hover:underline"
              onClick={() => {
                modalContext?.setIsModalOpen(true);
                router.push(user?.referralLink);
              }}
            >
              {user?.referralLink}
            </span>
          </div>
          <div className="mb-2 text-sm">
            Баланс: <span className="text-customTextAccent">{user?.moneyUSD}</span>
          </div>
          <div className="mb-2 text-sm">
            {user?.subscription &&
              isObjectSubscription(user?.subscription) &&
              new Date(user?.subscription.validUntil) > new Date() && (
                <>
                  <span className="text-customTextAccent">
                    Подписка активна до {new Date(user?.subscription.validUntil).toLocaleDateString()}{' '}
                  </span>
                  <Button className="mt-4" variant="custom" onClick={subscribeClickHandler}>
                    Продлить подписку
                  </Button>
                </>
              )}
            {(!user?.subscription ||
              (isObjectSubscription(user?.subscription) && user?.subscription.validUntil < new Date())) && (
              <Button className="mt-4" variant="custom" onClick={subscribeClickHandler}>
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
