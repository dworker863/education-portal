import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      Home
      <br />
      <Link href="/signin">Sign In</Link>
      <br />
      <Link href="/signup">Sign Up</Link>
      <br />
      <button>Sign Out</button>{' '}
    </main>
  );
}
