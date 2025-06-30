
export enum Material {
  Carbon = 'carbon',
  Aluminum = 'aluminum',
  Wood = 'wood',
}

export interface ArrowSet {
  name: string;
  weight: string;
  length: string;
  material: Material;
  spine: string;
}