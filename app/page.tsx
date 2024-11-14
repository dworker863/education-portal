import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';
import CourseForm from './components/course-form';
import TopLine from './components/top-line';
import { getAllCourses } from './libs/utils/courses';
import Courses from './components/courses';

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

      <Courses courses={courses} />
    </main>
  );
}
