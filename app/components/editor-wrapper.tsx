import sdk, { VM } from '@stackblitz/sdk';
import React, { FC, useEffect, useState } from 'react';
import Editor from './editor';
import { Button } from './button';
import { IExercise } from '../interfaces/interfaces';

type TEditorWrapperProps = {
  exercise: IExercise;
  tab: 'exercise' | 'solution';
};

const EditorWrapper: FC<TEditorWrapperProps> = ({ exercise, tab }) => {
  const [vm, setVm] = useState<VM | null>(null);

  useEffect(() => {
    const runEmbed = async () => {
      try {
        // Встраиваем проект
        const vm = await sdk.embedProjectId(
          'test',
          'education-portal-lesson-test',
          { view: 'editor' },
        );

        setVm(vm);
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    runEmbed();
  }, []);

  if (!vm) return null;

  return (
    <>
      <div className="h-[400px]">
        {tab === 'exercise' ? (
          <Editor
            userId="test-user"
            mode="exercise"
            exercise={exercise}
            vm={vm}
          />
        ) : (
          <Editor
            userId="test-user"
            mode="solution"
            exercise={exercise}
            vm={vm}
          />
        )}
      </div>
    </>
  );
};

export default EditorWrapper;
