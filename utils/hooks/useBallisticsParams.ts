import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AimDistanceMark, CalculatedMarks, Status } from '@/types';
import * as Sentry from '@sentry/react-native';

const calcBallisticsParams = (body: AimDistanceMark) => {
  return fetch('https://calculate-aim.azurewebsites.net/api/archerAim?task=CalcBallisticsPars', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
};

interface Ballistic {
  status: Status;
  error: any | null;
  calculateBallisticsParams: (body: AimDistanceMark) => Promise<CalculatedMarks | undefined>;
}

/**
 * Hook for calculating ballistics parameters
 * @returns {Ballistic} status, error, calculateBallisticsParams
 */
const useBallisticsParams = (): Ballistic => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  const calculateBallisticsParams = async (body: AimDistanceMark): Promise<CalculatedMarks | undefined> => {
    try {
      setStatus(Status.Pending);
      setError(null);

      // Clear calculated marks since ballistics parameters are changing
      try {
        await AsyncStorage.removeItem('calculatedMarks');
      } catch (removeError) {
        Sentry.captureException('Error removing calculated marks', removeError);
      }

      const result = await calcBallisticsParams(body);
      if (result.ok) {
        return result.json();
      }
    } catch (error) {
      setStatus(Status.Error);
      setError(error);
    } finally {
      setStatus(Status.Idle);
    }
  };

  return {
    status,
    error,
    calculateBallisticsParams,
  };
};

export default useBallisticsParams;
