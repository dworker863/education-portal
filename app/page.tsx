import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  return (
    <main>
      {JSON.stringify(session)}
      <br />
      <Link href="/signin">Sign In</Link>
      <br />
      <Link href="/signup">Sign Up</Link>
      <br />
      <button>Sign Out</button>{' '}
    </main>
  );
}
