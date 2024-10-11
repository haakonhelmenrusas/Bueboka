import { useReducer } from 'react';

interface CalcMarksFormProps {
  distanceFrom: string;
  distanceFromError: boolean;
  distanceTo: string;
  distanceToError: boolean;
  interval: string;
  intervalError: boolean;
  anglesVisible: boolean;
  angles: number[];
}

export type Action =
  | { type: 'SET_DISTANCE_FROM'; payload: string }
  | { type: 'SET_DISTANCE_FROM_ERROR'; payload: boolean }
  | { type: 'SET_DISTANCE_TO'; payload: string }
  | { type: 'SET_DISTANCE_TO_ERROR'; payload: boolean }
  | { type: 'SET_INTERVAL'; payload: string }
  | { type: 'SET_INTERVAL_ERROR'; payload: boolean }
  | { type: 'SET_ANGLES_VISIBLE'; payload: boolean }
  | { type: 'SET_ANGLES'; payload: number[] };

function reducer(state: CalcMarksFormProps, action: Action): CalcMarksFormProps {
  switch (action.type) {
    case 'SET_DISTANCE_FROM':
      return { ...state, distanceFrom: action.payload };
    case 'SET_DISTANCE_FROM_ERROR':
      return { ...state, distanceFromError: action.payload };
    case 'SET_DISTANCE_TO':
      return { ...state, distanceTo: action.payload };
    case 'SET_DISTANCE_TO_ERROR':
      return { ...state, distanceToError: action.payload };
    case 'SET_INTERVAL':
      return { ...state, interval: action.payload };
    case 'SET_INTERVAL_ERROR':
      return { ...state, intervalError: action.payload };
    case 'SET_ANGLES_VISIBLE':
      return { ...state, anglesVisible: action.payload };
    case 'SET_ANGLES':
      return { ...state, angles: action.payload };
    default:
      return state;
  }
}

export const useCalcMarksForm = () => {
  const INITIAL_STATE: CalcMarksFormProps = {
    distanceFrom: '',
    distanceFromError: false,
    distanceTo: '',
    distanceToError: false,
    interval: '',
    intervalError: false,
    anglesVisible: false,
    angles: [],
  };
  return useReducer(reducer, INITIAL_STATE);
};
