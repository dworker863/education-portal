export const calculateCourseProgress = (totalLessonsCount: number, completeLessonsCount: number) => {
  const progress = (completeLessonsCount / totalLessonsCount) * 100;
  return progress;
};
