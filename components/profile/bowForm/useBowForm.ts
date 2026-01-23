import { useReducer } from 'react';
import { BowType } from '@/types';

interface BowTypeState {
  name: string;
  nameError: boolean;
  type: BowType;
  eyeToNock: string;
  aimMeasure: string;
  eyeToSight: string;
  notes: string;
  isFavorite: boolean;
}

export type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_NAME_ERROR'; payload: boolean }
  | { type: 'SET_TYPE'; payload: BowType }
  | { type: 'SET_EYE_TO_NOCK'; payload: string }
  | { type: 'SET_AIM_MEASURE'; payload: string }
  | { type: 'SET_EYE_TO_SIGHT'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_IS_FAVORITE'; payload: boolean };

function reducer(state: BowTypeState, action: Action): BowTypeState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_NAME_ERROR':
      return { ...state, nameError: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_EYE_TO_NOCK':
      return { ...state, eyeToNock: action.payload };
    case 'SET_AIM_MEASURE':
      return { ...state, aimMeasure: action.payload };
    case 'SET_EYE_TO_SIGHT':
      return { ...state, eyeToSight: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_IS_FAVORITE':
      return { ...state, isFavorite: action.payload };
    default:
      return state;
  }
}

export const useBowForm = () => {
  const INITIAL_STATE: BowTypeState = {
    name: '',
    nameError: false,
    type: BowType.RECURVE,
    eyeToNock: '',
    aimMeasure: '',
    eyeToSight: '',
    notes: '',
    isFavorite: false,
  };
  return useReducer(reducer, INITIAL_STATE);
};
