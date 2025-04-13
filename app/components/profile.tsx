'use client';

import { FC, useContext, useEffect, useState } from 'react';
import { cn } from '../libs/cn';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './button';
import { MdModeEditOutline } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { ModalContext } from './app-wrapper';
import { Session } from 'next-auth';
import { getUserCoursesProgress } from '../libs/server-actions/progress-action';
import { IUserCourseProgress } from '../libs/interfaces/interfaces';

type TProfile = {
  mode: 'component' | 'page';
  showProfile?: boolean;
};

const Profile: FC<TProfile> = ({ mode, showProfile }) => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const session = useSession();

  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [userCourses, setUserCourses] = useState<IUserCourseProgress[] | null>(null);

  const user = session?.data?.user || authSession?.user;
  const completedCourses = userCourses?.filter((course) => course.completedAt);

  useEffect(() => {
    const handleReload = async () => {
      const data = await getSession();
      setAuthSession(data);
    };

    handleReload();
  }, [context]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const getUserCourses = async () => {
      const userCoursesProgress = await getUserCoursesProgress(user.id);
      console.log('PROFILE PROGRESS: ', userCoursesProgress);

      if (userCoursesProgress) {
        setUserCourses(userCoursesProgress);
      }
    };

    getUserCourses();
  }, [user]);

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
            <p className="text-sm text-customPrimary">{user?.name}</p>
            <p className="max-w-36 text-xs">{user?.email}</p>
          </div>
        </div>
        <Button
          className="mt-4"
          variant="custom"
          onClick={() => {
            context?.setIsModalOpen(true);
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
                  Имя: <span className="text-customPrimary">{user?.firstName}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    context?.setIsModalOpen(true);
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
                  Фамилия: <span className="text-customPrimary ">{user?.lastName}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    context?.setIsModalOpen(true);
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
                  <span className="text-customPrimary">{new Date(user?.birthDate).toLocaleDateString()}</span>
                </p>
                <Button
                  variant="customLink"
                  size="icon"
                  onClick={() => {
                    context?.setIsModalOpen(true);
                    router.push(`/edit-profile?email=${user?.email}&type=birthDate`);
                  }}
                >
                  <MdModeEditOutline className="text-customSecondary hover:scale-125" size={20} />
                </Button>
              </div>
            )}
          </div>
          <p className="mb-2 text-sm">
            Уровень: <span className="text-customPrimary">{user?.rank}</span>
          </p>
          <p className="mb-2 text-sm">
            Рейтинг: <span className="text-customPrimary">{user?.rating}</span>
          </p>
          {userCourses && userCourses.length > 0 && (
            <p className="mb-2 text-sm">
              Изучаемые курсы:
              {userCourses.map((courseProgress, index) => (
                <span
                  key={courseProgress.course?.name ? courseProgress.course?.name + index : index}
                  className="text-customPrimary ml-1"
                >
                  {courseProgress.course?.name && courseProgress.course?.name}
                  <span className="text-customSecondary"> ({courseProgress.progress}%)</span>
                </span>
              ))}
            </p>
          )}
          {completedCourses && completedCourses.length > 0 && (
            <p className="mb-2 text-sm">
              Завершенные курсы:
              {completedCourses.map((courseProgress, index) => (
                <span key={courseProgress.id + index} className="text-customPrimary">
                  {courseProgress.course?.name}
                </span>
              ))}
            </p>
          )}
          <p className="mb-2 text-sm">
            Баланс: <span className="text-customPrimary">{user?.moneyUSD}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
