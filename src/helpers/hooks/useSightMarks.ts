import { useState } from "react";

import { SightMarkCalculation, CalculatedMarks, Status } from "../../models";

const calcSightMarks = (body: SightMarkCalculation) => {
  return fetch(
    "https://calculate-aim.azurewebsites.net/api/archerAim?task=CalcSightMarks",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

const useSightMarks = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  const calculateSightMarks = async (
    body: SightMarkCalculation
  ): Promise<CalculatedMarks | undefined> => {
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
