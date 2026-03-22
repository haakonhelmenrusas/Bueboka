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
  userId: string;
  name: string;
  arrowsCount: number | null;
  diameter: number | null;
  weight: number | null;
  length: number | null;
  material: Material;
  spine: string | null;
  pointType: string | null;
  pointWeight: number | null;
  vanes: string | null;
  nock: string | null;
  notes: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
