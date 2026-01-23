/**
 * Bow type enum matching backend Prisma schema
 */
export enum BowType {
  RECURVE = 'RECURVE',
  COMPOUND = 'COMPOUND',
  LONGBOW = 'LONGBOW',
  BAREBOW = 'BAREBOW',
  HORSEBOW = 'HORSEBOW',
  TRADITIONAL = 'TRADITIONAL',
  OTHER = 'OTHER',
}

/**
 * Interface representing a Bow - matches backend Prisma schema
 */
export interface Bow {
  id: string;
  userId?: string;
  /**
   * The name of the bow.
   */
  name: string;

  /**
   * The type of the bow.
   */
  type: BowType;

  /**
   * The distance from the eye to the nock point in cm (optional).
   */
  eyeToNock?: number;

  /**
   * The aim measure distance in cm (optional).
   */
  aimMeasure?: number;

  /**
   * The distance from the eye to the sight in cm (optional).
   */
  eyeToSight?: number;

  /**
   * Additional notes about the bow.
   */
  notes?: string;

  /**
   * A boolean flag indicating whether the item is marked as a favorite.
   */
  isFavorite?: boolean;

  /**
   * Creation timestamp
   */
  createdAt?: Date;

  /**
   * Last update timestamp
   */
  updatedAt?: Date;
}
