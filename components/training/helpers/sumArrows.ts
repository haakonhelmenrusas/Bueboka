import { Training } from "@/types";

/** 
 * Function to sum the number of arrows shot in a given period.
 * @param {Training[]} trainings - Array of training sessions.
 * @param {string} [period] - The time period to filter by (e.g., "month", "7days").
 * @returns {number} - The total number of arrows shot in the specified period.
 */
export function sumArrows(trainings: Training[], period?: string) {
    if (!trainings || trainings.length === 0) {
        return 0;
    }
    let today = new Date();
    let filteredTrainings: Training[] = trainings;
    if (period === "month") {
        filteredTrainings = trainings.filter((training) => training.date.getMonth() === today.getMonth());
    } else if (period === "7days") {
        const date = new Date();
        date.setDate(today.getDate() - 7);
        filteredTrainings = trainings.filter((training) => training.date > date);
    }
    let total = 0;
    for (var t of filteredTrainings) {
        total += t.arrows;
    }

    return total;
  }