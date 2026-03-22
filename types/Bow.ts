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
  userId: string;
  name: string;
  type: BowType;
  eyeToNock: number | null;
  aimMeasure: number | null;
  eyeToSight: number | null;
  notes: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
