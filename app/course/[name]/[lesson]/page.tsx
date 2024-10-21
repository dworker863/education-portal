import Editor from '@/app/components/Editor';
import ExerciseForm from '@/app/components/ExerciseForm';

export default function Lesson({ params }: { params: { lesson: string } }) {
  return (
    <>
      <h1>Lesson: {params.lesson}</h1>
      <ExerciseForm />
      <div className="flex w-full px-10">
        <div className="w-2/4 text-center">Content</div>
        <div className="w-2/4 text-center">
          <h1>Exercise</h1>
          <div id="test">
            <Editor userId="test" />
          </div>
        </div>
      </div>
    </>
  );
}
