import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Button from './components/Button';

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
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button text="Sign Out" type="submit" />
      </form>
    </main>
  );
}
