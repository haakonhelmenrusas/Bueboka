export interface CalculatedMarks {
  initial_arrow_speed: number;
  cd: number;
  arrow_mass_gram: number;
  arrow_diameter_mm: number;
  length_eye_sight_cm: number;
  length_nock_eye_cm: number;
  sight_scaling: number;
  marks_bias: number;
  marks_std_deviation: number;
  given_distances: number[];
  given_marks: number[];
  calculated_marks: number[];
  marks_deviation: number[];
  arrow_speeds_at_distance: number[];
  relative_arrow_speeds_at_distance: number[];
  times_at_distance: number[];
  ballistics_pars: number[];
}
