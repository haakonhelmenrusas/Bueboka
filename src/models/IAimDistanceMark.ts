import { IBallisticsObject } from "../helpers/IBallisticsObject";

export interface IAimDistanceMark extends IBallisticsObject {
  marks: Array<number>;
  given_distances: Array<number>;
}
