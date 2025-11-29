'use client';

import { useSession } from 'next-auth/react';
import React, { useContext } from 'react';
import { ModalContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '../libs/server-actions/auth-actions';
import SearchBar from './searchbar';

const TopLine = () => {
  const session = useSession();
  const router = useRouter();
  const context = useContext(ModalContext);

  return (
    <div className="flex justify-between py-5">
      <nav className="flex gap-6">
        <Link href="/">Главная</Link>
        <Link href="/achievements">Достижения</Link>
        <Link href="/exercises">Упражнения</Link>
        <Link href="/prizetickets">Призовые билеты</Link>
      </nav>
      <div className="flex-1 flex justify-end gap-10">
        <div className="ml-auto">
          <SearchBar />
        </div>
        <div className="flex gap-4 justify-center items-center text-customAccent font-medium">
          {session?.data?.user ? (
            <>
              {session.data?.user.name || session.data?.user.email}
              <button
                onClick={async () => {
                  await logout();
                  window.location.reload();
                }}
              >
                Sign out
              </button>
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
    </div>
  );
};

export default TopLine;
