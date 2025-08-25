'use client';

import { Dispatch, FC, memo, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { ITest } from '../libs/interfaces/interfaces';
import { Button } from './button';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Базовая тема
import 'prismjs/plugins/line-numbers/prism-line-numbers'; // Плагин для нумерации строк
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import { completeTest } from '../libs/server-actions/tests-actions';
import { useSession } from 'next-auth/react';

type TTestProps = {
  test: ITest;
  setPassedTasks: Dispatch<SetStateAction<string[]>>;
  passedTasks: string[];
};

const Test: FC<TTestProps> = ({ test, passedTasks, setPassedTasks }) => {
  const session = useSession();
  const userId = session?.data?.user.id as string;

  const [buttonTypes, setButtonTypes] = useState<('custom' | 'customSuccess' | 'customFail')[]>(
    Array(test.variants.length).fill('custom'),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const task = useMemo(() => (test?.task ? DOMPurify.sanitize(test?.task) : ''), [test?.task]);
  const isDisabled = useMemo(() => buttonTypes.some((t) => t === 'customFail' || t === 'customSuccess'), [buttonTypes]);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const checkTestHandler = async (index: number, variant: string) => {
    try {
      const newButtonTypes = [...buttonTypes];

      if (variant !== test.solution) {
        newButtonTypes[index] = 'customFail';
      } else {
        const { user } = await completeTest(userId, test.id);

        const result = await session.update({
          rating: user.rating || 0,
        });

        newButtonTypes[index] = 'customSuccess';
        setPassedTasks([...passedTasks, test.id]);
      }

      setButtonTypes(newButtonTypes);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <>
      <h1 className="lesson-h1">{test.name}</h1>
      <p className="lesson-p">
        Необходимый Уровень: <span className="text-customSecondary font-semibold">{test.requiredRank}</span>
      </p>
      <p className="lesson-p">
        Баллы: <span className="text-customSecondary font-semibold">{test.prizePoints}</span>
      </p>
      <div ref={containerRef} className="lesson-p mb-10" dangerouslySetInnerHTML={{ __html: task }} />
      <div className="flex justify-between gap-3 flex-wrap">
        {test.variants.map((variant, index) => (
          <Button
            className="min-w-[150px]"
            variant={buttonTypes[index]}
            key={index + variant}
            size="lg"
            onClick={() => checkTestHandler(index, variant)}
            disabled={isDisabled}
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

export default memo(Test);
