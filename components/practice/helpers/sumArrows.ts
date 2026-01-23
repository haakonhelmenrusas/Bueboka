import { Practice } from '@/types';

/**
 * Function to sum the number of arrows shot in a given period.
 * @param {Practice[]} practices - Array of practice sessions.
 * @param {string} [period] - The time period to filter by (e.g., "month", "7 days").
 * @returns {number} - The total number of arrows shot in the specified period.
 */
export function sumArrows(practices: Practice[], period?: string): number {
  if (!practices || practices.length === 0) {
    return 0;
  }
  let today = new Date();
  let filteredPractices: Practice[] = practices;
  if (period === 'month') {
    filteredPractices = practices.filter((practice) => new Date(practice.date).getMonth() === today.getMonth());
  } else if (period === '7days') {
    const date = new Date();
    date.setDate(today.getDate() - 7);
    filteredPractices = practices.filter((practice) => new Date(practice.date) > date);
  }
  let total = 0;
  for (let p of filteredPractices) {
    // Sum arrows from all ends in the practice session
    total += p.ends?.reduce((sum, end) => sum + end.arrows, 0) || 0;
  }

  return total;
}
