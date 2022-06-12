import {useState} from "react";

import {ISightMarkCalculation, ICalculatedMarks, Status} from "../../models";

const calcSightMarks = (body: ISightMarkCalculation) => {
  return fetch('https://calculate-aim.azurewebsites.net/api/archerAim?task=CalcSightMarks', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: "POST",
    body: JSON.stringify(body),
  })
}

const useSightMarks = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  const calculateSightMarks = async (body: ISightMarkCalculation): Promise<ICalculatedMarks | undefined> => {
    try {
      setStatus(Status.Pending);
      const result = await calcSightMarks(body);
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
    calculateSightMarks,
  };
};

export default useSightMarks;
