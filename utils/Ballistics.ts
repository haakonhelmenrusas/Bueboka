/**
 * Interface representing the ballistics parameters for calculations.
 */
export interface Ballistics {
  /**
   * The category of the bow (e.g., recurve, compound).
   * @type {string}
   */
  bow_category: string;

  /**
   * The measured interval of the sight.
   * @type {number}
   */
  interval_sight_measured: number;

  /**
   * The real interval of the sight.
   * @type {number}
   */
  interval_sight_real: number;

  /**
   * The direction of the sight scale (e.g., up, down).
   * @type {string}
   */
  direction_of_sight_scale: string;

  /**
   * The diameter of the arrow in millimeters.
   * @type {number}
   */
  arrow_diameter_mm: number;

  /**
   * The mass of the arrow in grams.
   * @type {number}
   */
  arrow_mass_gram: number;

  /**
   * The length from the eye to the sight in centimeters.
   * @type {number}
   */
  length_eye_sight_cm: number;

  /**
   * The length from the nock to the eye in centimeters.
   * @type {number}
   */
  length_nock_eye_cm: number;

  /**
   * The position of the feet relative to the center (e.g., behind, center).
   * @type {string}
   */
  feet_behind_or_center: string;
}
