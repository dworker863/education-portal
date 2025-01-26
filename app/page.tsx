import { getAllCourses } from './libs/utils/courses';
import Courses from './components/courses';

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <main>
      <Courses courses={courses} />
    </main>
  );
}
