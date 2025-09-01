import { useReducer } from 'react';

interface CalcMarksFormProps {
  distanceFrom: string;
  distanceFromError: boolean;
  distanceTo: string;
  distanceToError: boolean;
  interval: string;
  intervalError: boolean;
  angles: number[];
}

export type Action =
  | { type: 'SET_DISTANCE_FROM'; payload: string }
  | { type: 'SET_DISTANCE_FROM_ERROR'; payload: boolean }
  | { type: 'SET_DISTANCE_TO'; payload: string }
  | { type: 'SET_DISTANCE_TO_ERROR'; payload: boolean }
  | { type: 'SET_INTERVAL'; payload: string }
  | { type: 'SET_INTERVAL_ERROR'; payload: boolean }
  | { type: 'SET_ANGLES'; payload: number[] }
  | { type: 'LOAD_FORM_DATA'; payload: CalcMarksFormProps };

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
    case 'SET_ANGLES':
      return { ...state, angles: action.payload };
    case 'LOAD_FORM_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const useCalcMarksForm = () => {
  const INITIAL_STATE: CalcMarksFormProps = {
    distanceFrom: '10',
    distanceFromError: false,
    distanceTo: '90',
    distanceToError: false,
    interval: '10',
    intervalError: false,
    angles: [-30, 0, 30],
  };
  return useReducer(reducer, INITIAL_STATE);
};
