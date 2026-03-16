/**
 * Material enum matching backend Prisma schema
 */
export enum Material {
  KARBON = 'KARBON',
  ALUMINIUM = 'ALUMINIUM',
  TREVERK = 'TREVERK',
}

/**
 * Arrows model matching backend Prisma schema
 */
export interface Arrows {
  id: string;
  userId?: string;
  name: string;
  arrowsCount?: number;
  diameter?: number;
  weight?: number;
  length?: number;
  material: Material;
  spine?: string;
  pointType?: string;
  pointWeight?: number;
  vanes?: string;
  nock?: string;
  notes?: string;
  isFavorite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
