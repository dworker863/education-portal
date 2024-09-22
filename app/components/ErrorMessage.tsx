import React, { FC } from 'react';

type TErrorMessageProps = {
  message: string;
};

const ErrorMessage: FC<TErrorMessageProps> = ({ message }) => {
  return <div className="text-red-600">{message}</div>;
};

export default ErrorMessage;
