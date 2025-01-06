import React, { FC, useState } from 'react';
import { Button } from './button';
import Image from 'next/image';
import { IoCloseSharp } from 'react-icons/io5';
import { UseFormSetValue } from 'react-hook-form';

type TThumbnailsProps = {
  field: string;
  thumbnails: any[];
  closeBtnHandler: UseFormSetValue<any>;
};

const Thumbnails: FC<TThumbnailsProps> = ({
  thumbnails,
  closeBtnHandler,
  field,
}) => {
  const [files, setFiles] = useState(thumbnails);

  return (
    <div className="mt-5">
      {thumbnails.map((thumbnail, index) => (
        <div
          key={URL.createObjectURL(thumbnail) + index}
          className="w-fit relative "
        >
          <Button
            className="absolute -top-1.5 -right-4 text-rose-600"
            variant="link"
            onClick={() => {
              setFiles(thumbnails.splice(index, 1));
              closeBtnHandler(field, thumbnails);
            }}
          >
            <IoCloseSharp size={24} />
          </Button>
          {URL.createObjectURL(thumbnail) && (
            <Image
              src={URL.createObjectURL(thumbnail)}
              alt=""
              width={100}
              height={100}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Thumbnails;
