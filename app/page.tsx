import { auth, signOut } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';
import CourseForm from './components/CourseForm';
import { getAllCourses } from './libs/utils';

export default async function Home() {
  const session = await auth();
  const courses = await getAllCourses();

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
      {/* {JSON.stringify(session)} */}

      <section>
        <CourseForm />
        {courses.length > 0 &&
          courses.map((course) => (
            <Link key={course.id} href={`/course/${course.name}`}>
              {course.name}
            </Link>
          ))}
        <br />
      </section>
    </main>
  );
}
