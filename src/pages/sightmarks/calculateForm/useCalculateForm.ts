import { useReducer } from "react";

interface CalculateFormState {
  opened: boolean;
  aimError: boolean;
  aimValue: number | undefined;
  distanceError: boolean;
  distanceValue: number | undefined;
}

export type Action =
  | { type: "SET_OPENED"; payload: boolean }
  | { type: "SET_AIM_ERROR"; payload: boolean }
  | { type: "SET_AIM_VALUE"; payload: number | undefined }
  | { type: "SET_DISTANCE_ERROR"; payload: boolean }
  | { type: "SET_DISTANCE_VALUE"; payload: number | undefined };

function reducer(state: CalculateFormState, action: Action): CalculateFormState {
  switch (action.type) {
    case "SET_OPENED":
      return { ...state, opened: action.payload };
    case "SET_AIM_ERROR":
      return { ...state, aimError: action.payload };
    case "SET_AIM_VALUE":
      return { ...state, aimValue: action.payload };
    case "SET_DISTANCE_ERROR":
      return { ...state, distanceError: action.payload };
    case "SET_DISTANCE_VALUE":
      return { ...state, distanceValue: action.payload };
    default:
      return state;
  }
}

export const useCalculateForm = () => {
  const INITIAL_STATE: CalculateFormState = {
    opened: false,
    aimError: false,
    aimValue: undefined,
    distanceError: false,
    distanceValue: undefined,
  };
  return useReducer(reducer, INITIAL_STATE);
};
