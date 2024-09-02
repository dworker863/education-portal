'use client';

import { FC } from 'react';
import { logout } from '../libs/server-actions';

type TButtonProps = {
  text: string;
};

const Button: FC<TButtonProps> = ({ text }) => {
  const handleClick = async () => {
    logout();
  };

  return <button onClick={handleClick}>{text}</button>;
};

export default Button;
