export interface ICalculatedMarks {
  calculated_marks: Array<number>;
  cd: number;
  distance: Array<number>;
  given_distance: Array<number>;
  given_marks: Array<number>;
  initial_arrow_speed: number;
  marks_deviation: Array<number>;
  marks_std_deviation: number;
  sight_marks_by_hill_angle: {
    0: Array<number>
  };
}