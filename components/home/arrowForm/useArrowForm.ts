import { useReducer } from 'react';
import { Material } from '@/types';

export interface ArrowSetState {
  name: string;
  weight: string;
  length: string;
  material: Material;
  spine: string;
  diameter: string;
  arrowsCount: string;
  pointType: string;
  pointWeight: string;
  vanes: string;
  nock: string;
  notes: string;
  isFavorite: boolean;
}

export type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_WEIGHT'; payload: string }
  | { type: 'SET_LENGTH'; payload: string }
  | { type: 'SET_MATERIAL'; payload: Material }
  | { type: 'SET_DIAMETER'; payload: string }
  | { type: 'SET_ARROWS_COUNT'; payload: string }
  | { type: 'SET_SPINE'; payload: string }
  | { type: 'SET_POINT_TYPE'; payload: string }
  | { type: 'SET_POINT_WEIGHT'; payload: string }
  | { type: 'SET_VANES'; payload: string }
  | { type: 'SET_NOCK'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_FAVORITE'; payload: boolean };

export function reducer(state: ArrowSetState, action: Action): ArrowSetState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_WEIGHT':
      return { ...state, weight: action.payload };
    case 'SET_LENGTH':
      return { ...state, length: action.payload };
    case 'SET_MATERIAL':
      return { ...state, material: action.payload };
    case 'SET_DIAMETER':
      return { ...state, diameter: action.payload };
    case 'SET_SPINE':
      return { ...state, spine: action.payload };
    case 'SET_ARROWS_COUNT':
      return { ...state, arrowsCount: action.payload };
    case 'SET_POINT_TYPE':
      return { ...state, pointType: action.payload };
    case 'SET_POINT_WEIGHT':
      return { ...state, pointWeight: action.payload };
    case 'SET_VANES':
      return { ...state, vanes: action.payload };
    case 'SET_NOCK':
      return { ...state, nock: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
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
    material: Material.KARBON,
    spine: '',
    diameter: '',
    arrowsCount: '',
    pointType: '',
    pointWeight: '',
    vanes: '',
    nock: '',
    notes: '',
    isFavorite: false,
  };
  return useReducer(reducer, INITIAL_STATE);
};
