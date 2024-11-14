import React, { FC } from 'react';

type TModalHeader = {
  type: 'login' | 'registration';
  label: string;
};

const ModalHeader: FC<TModalHeader> = ({ type, label }) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-semibold">
        {type === 'login' ? 'Войти' : 'Регистрация'}
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default ModalHeader;
