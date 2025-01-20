import { FC } from 'react';
import { cn } from '../libs/cn';

type TProfile = {
  showProfile: boolean;
};

const Profile: FC<TProfile> = ({ showProfile }) => {
  return (
    <div
      className={cn(
        'absolute top-0 right-[-400px] flex justify-center align-middle w-[400px] h-svh py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-[400px]': showProfile },
      )}
    >
      Profile
    </div>
  );
};

export default Profile;
