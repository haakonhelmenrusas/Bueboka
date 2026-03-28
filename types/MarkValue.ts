/**
 * Interface representing a mark value for archery.
 */
export interface MarkValue {
  /** The aim value for the mark. E.g. 2.3 */
  aim: number;

  /** The distance corresponding to the mark. */
  distance: number;

  /** Optional name for the sight mark set (used when creating a new set). */
  name?: string;
}
