import { useState } from 'react';
import { MarksResult, SightMarkCalc, Status } from '../../types';

const calcMarks = (body: SightMarkCalc) => {
  return fetch('https://calculate-aim.azurewebsites.net/api/archerAim?task=CalcSightMarks', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
};

const useCalculateMarks = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  const calculateMarks = async (body: SightMarkCalc): Promise<MarksResult | undefined> => {
    try {
      setStatus(Status.Pending);
      setError(null);
      const result = await calcMarks(body);
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
    calculateMarks,
  };
};

export default useCalculateMarks;
