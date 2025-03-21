import { Ballistics } from '@/utils/Ballistics';

/**
 * Interface representing the aim distance mark parameters for calculations.
 */
export interface AimDistanceMark extends Ballistics {
  /**
   * The new aim mark that the user has input.
   * @type {number}
   */
  new_given_mark: number;

  /**
   * The new distance that the user has input.
   * @type {number}
   */
  new_given_distance: number;

  /**
   * The list of aim marks that comes from the calculation.
   * @type {number[]}
   */
  given_marks: number[];

  /**
   * The list of distances that comes from the calculation.
   * The distances are in meters.
   * @type {number[]}
   */
  given_distances: number[];
}
