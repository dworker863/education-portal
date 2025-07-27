'use client';

import sdk, { VM } from '@stackblitz/sdk';
import React, { FC, useEffect, useRef, useState } from 'react';
import Editor from './editor';
import { IExercise } from '../libs/interfaces/interfaces';
import { useSession } from 'next-auth/react';

type TEditorWrapperProps = {
  userId: string;
  exercise: IExercise;
  tab: 'exercise' | 'solution';
};

const EditorWrapper: FC<TEditorWrapperProps> = ({ exercise, tab }) => {
  const session = useSession();
  const userId = session?.data?.user.id;
  const [vm, setVm] = useState<VM | null>(null);

  useEffect(() => {
    const loadEmbedProject = async () => {
      try {
        const vm = await sdk.embedProjectId(
          exercise.id,
          `${exercise.language.toLowerCase()}-${exercise.name.toLowerCase()}`,
          {
            view: 'editor',
          },
        );

        setVm(vm);
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    loadEmbedProject();

    return () => {
      console.log('UNMOUNTED');
    };
  }, []);

  if (!vm || !userId) return null;

  return (
    <>
      <div className="h-[400px]">
        {tab === 'exercise' ? (
          <Editor userId={userId} mode="exercise" exercise={exercise} vm={vm} />
        ) : (
          <Editor userId={userId} mode="solution" exercise={exercise} vm={vm} />
        )}
      </div>
    </>
  );
};

export default EditorWrapper;
