import { FC } from 'react';
import { cn } from '../libs/cn';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type TProfile = {
  showProfile: boolean;
};

const Profile: FC<TProfile> = ({ showProfile }) => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div
      className={cn(
        'absolute top-0 right-[-400px] -z-10 flex flex-col w-[400px] h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-[400px]': showProfile },
      )}
    >
      <div className="mb-10">
        <div className="flex gap-4 ">
          <div className="w-20 rounded-full overflow-hidden">
            {user?.image && (
              <Image
                src={user?.image?.replace(/\\/gi, '/')}
                alt="avatar"
                width={100}
                height={100}
              />
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-orange-700">{user?.name}</p>
            <p className="max-w-36 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-rose-600">Инфо</h2>
        <div className="flex flex-col">
          {user?.firstName && (
            <p className="mb-2 text-sm">
              Имя: <span className="text-orange-700">{user?.firstName}</span>
            </p>
          )}
          {user?.lastName && (
            <p className="mb-2 text-sm">
              Факмилия:{' '}
              <span className="text-orange-700">{user?.lastName}</span>
            </p>
          )}
          {user?.birthDate && (
            <p className="mb-2 text-sm">
              Дата рождения:{' '}
              <span className="text-orange-700">
                {new Date(user?.birthDate).toLocaleDateString()}
              </span>
            </p>
          )}
          <p className="mb-2 text-sm">
            Ранг: <span className="text-orange-700">{user?.rank}</span>
          </p>
          <p className="mb-2 text-sm">
            Рейтинг: <span className="text-orange-700">{user?.rating}</span>
          </p>
          <p className="mb-2 text-sm">
            Баланс: <span className="text-orange-700">{user?.moneyUSD}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
