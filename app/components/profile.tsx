'use client';

import { FC } from 'react';
import { cn } from '../libs/cn';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './button';
import { MdModeEditOutline } from 'react-icons/md';

type TProfile = {
  mode: 'component' | 'page';
  showProfile?: boolean;
};

const Profile: FC<TProfile> = ({ mode, showProfile }) => {
  const { data: session } = useSession();
  const user = session?.user;

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
        <Button className="mt-4" variant="custom" onClick={() => {}}>
          Изменить
        </Button>
      </div>
      <div>
        <h2 className="mb-4 text-customSecondary">Инфо</h2>
        <div className="flex flex-col space-y-4">
          {user?.firstName && (
            <div className="flex items-center">
              <p className="text-sm">
                Имя: <span className="text-customPrimary">{user?.firstName}</span>
              </p>
              <Button variant="customLink" size="icon" onClick={() => {}}>
                <MdModeEditOutline className="text-customSecondary hover:scale-125" size={20} />
              </Button>
            </div>
          )}
          {user?.lastName && (
            <div className="flex items-center">
              <p className="text-sm">
                Фамилия: <span className="text-customPrimary ">{user?.lastName}</span>
              </p>
              <Button variant="customLink" size="icon" onClick={() => {}}>
                <MdModeEditOutline className="hover:scale-125" size={20} />
              </Button>
            </div>
          )}
          {user?.birthDate && (
            <div className="flex items-center">
              <p className="text-sm">
                Дата рождения:{' '}
                <span className="text-customPrimary">{new Date(user?.birthDate).toLocaleDateString()}</span>
              </p>
              <Button variant="customLink" size="icon" onClick={() => {}}>
                <MdModeEditOutline className="text-customSecondary hover:scale-125" size={20} />
              </Button>
            </div>
          )}
          <p className="mb-2 text-sm">
            Уровень: <span className="text-customPrimary">{user?.rank}</span>
          </p>
          <p className="mb-2 text-sm">
            Рейтинг: <span className="text-customPrimary">{user?.rating}</span>
          </p>
          <p className="mb-2 text-sm">
            Баланс: <span className="text-customPrimary">{user?.moneyUSD}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
