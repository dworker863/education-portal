import React, { FC } from 'react';

type TModalHeader = {
  type: 'login' | 'registration' | 'reset-password' | 'new-password' | 'edit-profile';
  label: string;
};

const ModalHeader: FC<TModalHeader> = ({ type, label }) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl text-primary-foreground font-semibold">
        {type === 'login' && 'Войти'}
        {type === 'registration' && 'Регистрация'}
        {type === 'reset-password' && 'Сменить пароль'}
        {type === 'new-password' && 'Новый пароль'}
        {type === 'edit-profile' && 'Профиль'}
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default ModalHeader;
