import { useState } from "react";
import { AimDistanceMark, CalculatedMarks, Status } from "../../types";

const calcBallisticsParams = (body: AimDistanceMark) => {
  return fetch("https://calculate-aim.azurewebsites.net/api/archerAim?task=CalcBallisticsPars", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });
};

const useBallisticsParams = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  const calculateBallisticsParams = async (body: AimDistanceMark): Promise<CalculatedMarks | undefined> => {
    try {
      setStatus(Status.Pending);
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
