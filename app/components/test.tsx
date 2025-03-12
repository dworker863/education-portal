'use client';

import { FC, useState } from 'react';
import { ITest } from '../libs/interfaces/interfaces';
import { Button } from './button';
import { IoMdClose } from 'react-icons/io';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';

type TTestProps = {
  test: ITest;
};

const Test: FC<TTestProps> = ({ test }) => {
  // const [result, setResult] = useState<string | null>(null);
  const [buttonTypes, setButtonTypes] = useState<('custom' | 'customSuccess' | 'customFail')[]>(
    Array(test.variants.length).fill('custom'),
  );

  const handleClick = (index: number, variant: string) => {
    const newButtonTypes = [...buttonTypes];

    if (variant === test.solution) {
      newButtonTypes[index] = 'customSuccess';
    } else {
      newButtonTypes[index] = 'customFail';
    }

    setButtonTypes(newButtonTypes);
  };

  return (
    <>
      <h2 className="mb-5 text-center">{test.name}</h2>
      <p className="mb-5">{test.task}</p>
      <p>
        Необходимый Уровень: <span className="text-customSecondary font-semibold">{test.requiredRank}</span>
      </p>
      <p className="mb-5">
        Баллы: <span className="text-customSecondary font-semibold">{test.prizePoints}</span>
      </p>
      <div className="flex justify-between">
        {test.variants.map((variant, index) => (
          <Button
            className="min-w-[150px]"
            variant={buttonTypes[index]}
            key={index + variant}
            size="lg"
            onClick={() => handleClick(index, variant)}
            disabled={buttonTypes.some((type) => type === 'customFail' || type === 'customSuccess')}
          >
            {buttonTypes[index] === 'customFail' && <SlClose className="mr-2" size={20} />}
            {buttonTypes[index] === 'customSuccess' && <GoIssueClosed className="mr-2" size={20} />}
            {variant}
          </Button>
        ))}
      </div>
      <div className="mb-5" id="test"></div>
    </>
  );
};

export default Test;
