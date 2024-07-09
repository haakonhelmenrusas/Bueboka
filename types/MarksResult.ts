export interface MarksResult {
  ballistics_pars: number[];
  distances: number[];
  sight_marks_by_hill_angle: {
    angle: number[];
  };
  arrow_speed_by_angle: {
    speed: number[];
  };
}
