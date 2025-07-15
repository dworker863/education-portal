import Courses from './components/courses';
import { getAllCourses } from './libs/utils/courses';

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <main>
      <Courses courses={courses} />
    </main>
  );
}
