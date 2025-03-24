/**
 * Interface representing a set of marks for archery.
 */
export interface MarkSet {
  /** The name of the mark set. */
  name: string;

  /** Array of marks corresponding to the distances. */
  marks: number[];

  /** Array of distances corresponding to the marks. */
  distances: number[];
}
