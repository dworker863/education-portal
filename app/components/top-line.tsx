'use client';

import { getSession, signOut } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import Link from 'next/link';

const TopLine = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const context = useContext(ModalContext);

  useEffect(() => {
    let mounted = true;

    if (!context) return;

    const loadSession = async () => {
      try {
        const data = await getSession();

        if (!mounted) return;

        setSession(data);
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, [context]);

  return (
    <div className="flex justify-between py-5">
      <nav className="flex gap-6">
        <Link href="/">Главная</Link>
        <Link href="/achievements">Достижения</Link>
        <Link href="/exercises">Упражнения</Link>
        <Link href="/prizetickets">Призовые билеты</Link>
      </nav>
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
