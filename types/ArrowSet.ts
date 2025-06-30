
export enum Material {
  Carbon = 'carbon',
  Aluminum = 'aluminum',
  Wood = 'wood',
}

export interface ArrowSet {
  name: string;
  weight: number;
  length: number;
  diameter: number;
  material: Material;
  spine: number;
}