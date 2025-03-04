import { auth } from '@/auth';
import Courses from './components/courses';
import { getAllCourses } from './libs/server-actions/courses-actions';

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <main>
      <Courses courses={courses} />
    </main>
  );
}
