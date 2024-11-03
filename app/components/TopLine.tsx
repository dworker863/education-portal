'use client';

import { signOut } from '@/auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { FC, useContext, useEffect } from 'react';
import { ModalContext } from './AppWrapper';
import { useRouter } from 'next/navigation';

const TopLine = () => {
  const { data } = useSession();
  const router = useRouter();
  const context = useContext(ModalContext);

  return (
    <div className="flex justify-between">
      <div className="flex-1 flex justify-start gap-5">Right</div>
      <div className="flex-1 flex justify-end gap-5">
        {data?.user ? (
          data.user.name
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
                router.push('/signin');
              }}
            >
              Sign Up
            </button>
            {/* <Link href="/signin">Sign In</Link> */}
            {/* <Link href="/signup">Sign Up</Link> */}
          </>
        )}
        {/* <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          {data?.user && <button type="submit">Sign Out</button>}
        </form> */}
      </div>
    </div>
  );
};

export default TopLine;
