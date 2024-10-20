import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Button from './components/Button';
import Image from 'next/image';

export default async function Home() {
  const session = await auth();

  return (
    <main>
      {session?.user?.image && (
        <Image
          src={session?.user?.image?.replace(/\\/gi, '/')}
          alt="avatar"
          width={100}
          height={100}
        />
      )}
      {JSON.stringify(session)}
      <br />
      <Link href="/signin">Sign In</Link>
      <br />
      <Link href="/signup">Sign Up</Link>
      <br />
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button text="Sign Out" type="submit" />
      </form>
      <section>
        <Link href="/course/html">HTML</Link>
        <br />
        <Link href="/course/nextjs">Next.js</Link>
      </section>
    </main>
  );
}
