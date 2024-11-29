import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

export const getNextOccurrences = (dayOfWeek: number, count: number): string[] => {
  const dates: string[] = [];
  let currentDate = new Date();

  while (dates.length < count) {
    if (currentDate.getDay() > dayOfWeek) {
      currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay() + dayOfWeek));
    } else {
      currentDate.setDate(currentDate.getDate() + (dayOfWeek - currentDate.getDay()));
    }

    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  return dates;
};

export const formatEventDate = (date: string): string => {
  return format(new Date(date), 'MMMM d, yyyy');
};

export const getCalendarDays = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  return eachDayOfInterval({ start: monthStart, end: monthEnd });
};

export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return isSameMonth(date, currentDate);
};

export const isCurrentDay = (date: Date): boolean => {
  return isToday(date);
};