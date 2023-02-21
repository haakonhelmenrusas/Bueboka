import { BallisticsObject } from "../helpers/BallisticsObject";

export interface AimDistanceMark extends BallisticsObject {
  marks: Array<number>;
  given_distances: Array<number>;
}
