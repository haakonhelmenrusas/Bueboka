/**
 * SightMarks feature types
 */

export interface SightMark {
  id: string;
  userId: string;
  bowId: string;
  name: string | null;
  givenMarks: number[];
  givenDistances: number[];
  ballisticsParameters: any;
  createdAt: string;
  updatedAt: string;
  bow?: { id: string; name: string; type?: string };
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
  sightMarksByAngle: any;
  arrowSpeedByAngle: any;
  createdAt: string;
  updatedAt: string;
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
  distances?: number[];
  angles: number[];
}

export interface MarksResult {
  distances: number[];
  sight_marks_by_hill_angle: Record<string, number[]>;
  arrow_speed_by_angle: Record<string, number[]>;
}
