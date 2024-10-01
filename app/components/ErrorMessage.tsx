import React, { FC } from 'react';

type TErrorMessageProps = {
  message: string;
};

const ErrorMessage: FC<TErrorMessageProps> = ({ message }) => {
  return <p className="text-red-600">{message}</p>;
};

export default ErrorMessage;
