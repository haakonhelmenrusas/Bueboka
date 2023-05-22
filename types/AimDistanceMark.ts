import { Ballistics } from '../utils/Ballistics';

export interface AimDistanceMark extends Ballistics {
  marks: number[];
  given_distances: number[];
}
