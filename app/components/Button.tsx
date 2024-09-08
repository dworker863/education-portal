'use client';

import { FC } from 'react';
import { logout } from '../libs/server-actions';

type TButtonProps = {
  text: string;
  type: 'button' | 'submit' | 'reset';
};

const Button: FC<TButtonProps> = ({ text, type }) => {
  const handleClick = async () => {
    await logout();
  };

  return (
    <button type={type} onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;
