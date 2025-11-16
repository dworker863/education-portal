import { ChannelProvider } from 'ably/react';
import Chat from './components/chat';
import Courses from './components/courses';
import { getAllCourses } from './libs/utils/courses';

export const revalidate = 86400;

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <main>
      <Courses courses={courses} />
      {/* <ChannelProvider channelName="get-started"> */}
      <Chat />
      {/* </ChannelProvider> */}
    </main>
  );
}
