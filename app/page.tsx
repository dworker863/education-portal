import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';
import CourseForm from './components/CourseForm';
import { getAllCourses } from './libs/utils';
import Courses from './components/Courses';
import TopLine from './components/TopLine';

export default async function Home() {
  const session = await auth();
  const courses = await getAllCourses();

  return (
    <main>
      <TopLine />

      {session?.user?.image && (
        <Image
          src={session?.user?.image?.replace(/\\/gi, '/')}
          alt="avatar"
          width={100}
          height={100}
        />
      )}
      {/* {JSON.stringify(session)} */}

      <Courses courses={courses} />
    </main>
  );
}
