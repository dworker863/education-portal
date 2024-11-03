import Link from 'next/link';
import React, { FC } from 'react';

const TopLine = () => {
  return (
    <div className="flex justify-between">
      <div className="flex-1 flex justify-start gap-5">Right</div>
      <div className="flex-1 flex justify-end gap-5">
        <Link href="/signin">Sign In</Link>
        <Link href="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default TopLine;
