'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { IExercise, ILesson, ITest } from '../libs/interfaces/interfaces';
import Video from './video';
import Exercise from './exercise';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Базовая тема
import 'prismjs/plugins/line-numbers/prism-line-numbers'; // Плагин для нумерации строк
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'; // Стили для нумерации строк
import Test from './test';
import { Button } from './button';
import { GrNext } from 'react-icons/gr';

type TLessonCardProps = {
  lesson: ILesson | null;
  exercises: IExercise[];
  tests: ITest[];
};

const LessonCard: FC<TLessonCardProps> = ({ lesson, exercises, tests }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = lesson?.content ? DOMPurify.sanitize(lesson?.content) : '';
  const [practiceActive, setPracticeActive] = useState(0);

  const practics = [...tests, ...exercises];

  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <div className="flex w-full gap-10 p-10 bg-primary text-primary-foreground rounded-lg">
      <div className="w-2/4">
        <h2 className="mb-5 text-center">Теория</h2>
        <div ref={containerRef} className="mb-10" dangerouslySetInnerHTML={{ __html: content }} />
        {lesson?.video && <Video src={lesson?.video} />}
      </div>
      <div className="w-2/4">
        {practics.length > 0 &&
          practics.map((practice, index) => (
            <div className="relative" key={practice.name + index}>
              {'variants' in practice ? (
                <Test test={practice} active={index === practiceActive} />
              ) : (
                <Exercise exercise={practice} active={index === practiceActive} />
              )}
              {index === practiceActive && (
                <Button
                  variant="customCircle"
                  onClick={() => setPracticeActive(index + 1)}
                  className="right-2"
                  size="icon"
                  disabled={practiceActive + 1 >= practics.length}
                >
                  <GrNext size={20} />
                </Button>
              )}
              {index === practiceActive && (
                <Button
                  variant="customCircle"
                  onClick={() => setPracticeActive(index - 1)}
                  className="left-2 rotate-180"
                  size="icon"
                  disabled={practiceActive - 1 < 0}
                >
                  <GrNext size={20} />
                </Button>
              )}
            </div>
          ))}
      </div>
      {/* <div className="w-2/4">{exercise ? <Exercise exercise={exercise} /> : test ? <Test test={test} /> : ''}</div> */}
    </div>
  );
};

export default LessonCard;
