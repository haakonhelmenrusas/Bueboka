/**
 * Interface representing the calculated marks for archery.
 */
export interface CalculatedMarks {
  /** Initial speed of the arrow in meters per second. */
  initial_arrow_speed: number;

  /** Coefficient of drag for the arrow. */
  cd: number;

  /** Mass of the arrow in grams. */
  arrow_mass_gram: number;

  /** Diameter of the arrow in millimeters. */
  arrow_diameter_mm: number;

  /** Distance from the eye to the sight in centimeters. */
  length_eye_sight_cm: number;

  /** Distance from the nock to the eye in centimeters. */
  length_nock_eye_cm: number;

  /** Scaling factor for the sight. */
  sight_scaling: number;

  /** Bias for the marks. */
  marks_bias: number;

  /** Standard deviation of the marks. */
  marks_std_deviation: number;

  /** Array of given distances in meters. */
  given_distances: number[];

  /** Array of given marks corresponding to the given distances. */
  given_marks: number[];

  /** Array of calculated marks. */
  calculated_marks: number[];

  /** Array of deviations of the marks. */
  marks_deviation: number[];

  /** Array of arrow speeds at different distances in meters per second. */
  arrow_speeds_at_distance: number[];

  /** Array of relative arrow speeds at different distances. */
  relative_arrow_speeds_at_distance: number[];

  /** Array of times at different distances in seconds. */
  times_at_distance: number[];

  /** Array of ballistic parameters. */
  ballistics_pars: number[];
}
