import { Ballistics } from '../utils/Ballistics';

export interface AimDistanceMark extends Ballistics {
  new_given_mark: number;
  new_given_distances: number;
}
