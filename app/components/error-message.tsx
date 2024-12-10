import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

type TErrorMessageProps = {
  message: string;
};

const ErrorMessage: FC<TErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
