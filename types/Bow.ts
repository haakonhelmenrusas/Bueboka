/**
 * Interface representing a Bow.
 */
export interface Bow {
  id: string;
  /**
   * The name of the bow.
   */
  bowName: string;

  /**
   * The type of the bow.
   */
  bowType: string;

  /**
   * The placement of the bow.
   */
  placement: string;

  /**
   * The distance from the eye to the nock point in cm (optional).
   */
  eyeToNock?: number;

  /**
   * The distance from the eye to the aim point in cm (optional).
   */
  eyeToAim?: number;

  /**
   * The real interval sight measurement (optional).
   */
  interval_sight_real?: number;

  /**
   * The measured interval sight measurement (optional).
   */
  interval_sight_measured?: number;
}
