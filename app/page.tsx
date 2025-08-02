import Courses from './components/courses';
import { getAllCourses } from './libs/utils/courses';

export const revalidate = 86400;

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <main>
      <Courses courses={courses} />
    </main>
  );
}
