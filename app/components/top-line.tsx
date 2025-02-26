'use client';

import { getSession, signOut } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

const TopLine = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const context = useContext(ModalContext);

  useEffect(() => {
    const handleReload = async () => {
      const data = await getSession();
      setSession(data);
    };

    handleReload();
  }, [context]);

  return (
    <div className="flex justify-between py-5">
      <div className="flex-1 flex justify-start gap-5">Right</div>
      <div className="flex-1 flex justify-end gap-5">
        {session?.user ? (
          <>
            {session.user.name || session.user.email}
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                context?.setIsModalOpen(true);
                router.push('/signin');
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                context?.setIsModalOpen(true);
                router.push('/signup');
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopLine;
