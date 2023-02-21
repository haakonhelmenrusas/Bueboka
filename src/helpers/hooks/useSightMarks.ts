import { useState } from "react";
import { SightMarkCalculation, Status } from "../../types";

const calcSightMarks = (body: SightMarkCalculation) => {
  return fetch("https://calculate-aim.azurewebsites.net/api/archerAim?task=CalcSightMarks", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });
};

interface MarksResultByAngle {
  ballistics_pars: Array<number>;
  distances: Array<number>;
  sight_marks_by_hill_angle: {
    [key: string]: Array<number>;
  };
}

const useSightMarks = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [data, setData] = useState<MarksResultByAngle>();
  const [error, setError] = useState<any | null>(null);

  const calculateSightMarks = async (body: SightMarkCalculation): Promise<void> => {
    try {
      setStatus(Status.Pending);
      const result = await calcSightMarks(body);
      if (result.ok) {
        setData((await result.json()) as MarksResultByAngle);
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
    data,
    calculateSightMarks,
  };
};

export default useSightMarks;
