export const getDaysUntilDate = (targetDate: Date) => {
  const diffInMs = targetDate.getTime() - new Date().getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
};
