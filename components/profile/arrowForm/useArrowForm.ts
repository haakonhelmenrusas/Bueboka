import { useReducer } from 'react';
import { Material } from '@/types';

export interface ArrowSetState {
  name: string;
  weight: string;
  length: string;
  material: Material;
  spine: string;
  diameter: string;
  numberOfArrows: string;
  isFavorite: boolean;
}

export type Action =
  | { type: 'SET_ARROW_NAME'; payload: string }
  | { type: 'SET_ARROW_WEIGHT'; payload: string }
  | { type: 'SET_ARROW_LENGTH'; payload: string }
  | { type: 'SET_MATERIAL'; payload: Material }
  | { type: 'SET_DIAMETER'; payload: string }
  | { type: 'SET_NUMBER_OF_ARROWS'; payload: string }
  | { type: 'SET_SPINE'; payload: string }
  | { type: 'SET_FAVORITE'; payload: boolean };

export function reducer(state: ArrowSetState, action: Action): ArrowSetState {
  switch (action.type) {
    case 'SET_ARROW_NAME':
      return { ...state, name: action.payload };
    case 'SET_ARROW_WEIGHT':
      return { ...state, weight: action.payload };
    case 'SET_ARROW_LENGTH':
      return { ...state, length: action.payload };
    case 'SET_MATERIAL':
      return { ...state, material: action.payload };
    case 'SET_DIAMETER':
      return { ...state, diameter: action.payload };
    case 'SET_SPINE':
      return { ...state, spine: action.payload };
    case 'SET_NUMBER_OF_ARROWS':
      return { ...state, numberOfArrows: action.payload };
    case 'SET_FAVORITE':
      return { ...state, isFavorite: action.payload };
    default:
      return state;
  }
}

export const useArrowForm = () => {
  const INITIAL_STATE: ArrowSetState = {
    name: '',
    weight: '',
    length: '',
    material: Material.Karbon,
    spine: '',
    diameter: '',
    numberOfArrows: '',
    isFavorite: false,
  };
  return useReducer(reducer, INITIAL_STATE);
};
