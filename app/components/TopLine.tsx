import { auth, signOut } from '@/auth';
import Link from 'next/link';
import React, { FC } from 'react';

const TopLine = async () => {
  const session = await auth();

  return (
    <div className="flex justify-between">
      <div className="flex-1 flex justify-start gap-5">Right</div>
      <div className="flex-1 flex justify-end gap-5">
        {session?.user ? (
          session.user.name
        ) : (
          <>
            <Link href="/signin">Sign In</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          {session?.user && <button type="submit">Sign Out</button>}
        </form>
      </div>
    </div>
  );
};

export default TopLine;
