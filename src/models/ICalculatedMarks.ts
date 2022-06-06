export interface ICalculatedMarks {
  initial_arrow_speed: number;
  cd: number;
  arrow_mass_gram: number;
  arrow_diameter_mm: number;
  length_eye_sight_cm: number;
  length_nock_eye_cm: number;
  sight_scaling: number;
  marks_bias: number;
  marks_std_deviation: number;
  given_distance: Array<number>;
  given_marks: Array<number>;
  calculated_marks: Array<number>;
  marks_deviation: Array<number>;
  arrow_speeds_at_distance: Array<number>;
  relative_arrow_speeds_at_distance: Array<number>;
  times_at_distance: Array<number>;
  ballistics_pars: Array<number>;
}
