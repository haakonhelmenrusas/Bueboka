/**
 * Sorts an array of items based on their favorite status and then alphabetically by their name or bowName property.
 * Items marked as favorite will appear first in the sorted array.
 *
 * @param {Array<T>} items - The array of items to be sorted. Each item can optionally have
 * `isFavorite`, `name`, and `bowName` properties.
 * @return {Array<T>} A new array of items sorted by favorite status and then alphabetically by name or bowName.
 */
export function sortItems<T extends { isFavorite?: boolean; name?: string; bowName?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    // First, sort by favorite status
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    // Then sort alphabetically by name (handles both bowName and name properties)
    const nameA = (a.bowName || a.name || '').toLowerCase();
    const nameB = (b.bowName || b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
