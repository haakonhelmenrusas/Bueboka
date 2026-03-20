/**
 * SightMarks feature types
 */

export interface BowSpecification {
  id: string;
  userId: string;
  bowId: string;
  intervalSightReal?: number;
  intervalSightMeasured?: number;
  placement?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SightMark {
  id: string;
  userId: string;
  bowSpecificationId: string;
  givenMarks: number[];
  givenDistances: number[];
  ballisticsParameters: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SightMarkResult {
  id: string;
  userId: string;
  sightMarkId: string;
  distanceFrom: number;
  distanceTo: number;
  interval: number;
  angles: number[];
  distances: number[];
  sightMarksByAngle: number[];
  arrowSpeedByAngle: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AimDistanceMark {
  ballistics_pars?: number[];
  bow_category: string;
  interval_sight_real?: number;
  interval_sight_measured?: number;
  arrow_diameter_mm?: number;
  arrow_mass_gram?: number;
  feet_behind_or_center?: string;
  length_eye_sight_cm?: number;
  length_nock_eye_cm?: number;
  new_given_mark: number;
  new_given_distance: number;
  given_marks: number[];
  given_distances: number[];
  direction_of_sight_scale?: string;
}

export interface CalculatedMarks {
  given_distances: number[];
  given_marks: number[];
  calculated_marks: number[];
  ballistics_pars: number[];
}

export interface SightMarkCalc {
  ballistics_pars: number[];
  distances_def: number[];
  angles: number[];
}

export interface MarksResult {
  distances: number[];
  sight_marks_by_hill_angle: number[];
  arrow_speed_by_angle: number[];
}
