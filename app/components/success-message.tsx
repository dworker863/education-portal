import { CheckCircledIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

type TErrorMessageProps = {
  message: string;
};

const SuccessMessage: FC<TErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;
