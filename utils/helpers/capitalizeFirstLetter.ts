/**
 *  Capitalize the first letter of a word.
 * @param string
 * @returns Word with first letter capitalized.
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
