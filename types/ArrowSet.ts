export enum Material {
  Karbon = 'Karbon',
  Aluminum = 'Aluminum',
  Treverk = 'Treverk',
}

export interface ArrowSet {
  name: string;
  weight: number;
  length: number;
  diameter: number;
  material: Material;
  spine: number;
  numberOfArrows: number;
  isFavorite?: boolean;
}
