import React, { FC } from 'react';

type TSuccessMessageProps = {
  message: string;
};

const SuccessMessage: FC<TSuccessMessageProps> = ({ message }) => {
  return <div className="text-emerald-600">{message}</div>;
};

export default SuccessMessage;
