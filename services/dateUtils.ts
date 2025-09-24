
// A small set of date utilities to avoid a large library dependency.

/**
 * Adds a specified number of days to a date.
 * @param date The starting date (can be string, number, or Date object).
 * @param days The number of days to add.
 * @returns A new Date object.
 */
export const addDays = (date: string | number | Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtracts a specified number of days from a date.
 * @param date The starting date.
 * @param days The number of days to subtract.
 * @returns A new Date object.
 */
export const subDays = (date: string | number | Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

/**
 * Calculates the difference in days between two dates.
 * @param dateLeft The first date.
 * @param dateRight The second date.
 * @returns The number of days between the dates.
 */
export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
  const oneDay = 1000 * 60 * 60 * 24;
  const diffTime = dateLeft.getTime() - dateRight.getTime();
  return Math.round(diffTime / oneDay);
};

/**
 * Formats a date into 'YYYY-MM-DD' string format.
 * @param date The date to format.
 * @returns The formatted date string.
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Checks if two dates are on the same day, ignoring time.
 * @param date1 First date.
 * @param date2 Second date.
 * @returns True if they are the same day.
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
