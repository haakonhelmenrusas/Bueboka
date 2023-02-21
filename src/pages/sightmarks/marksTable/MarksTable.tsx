import React, { useEffect } from "react";
import { AlertCircle, BorderOuter, Ruler2 } from "tabler-icons-react";
import { Alert, Skeleton, Table } from "@mantine/core";
import { useFetchBallistics, useSightMarks } from "../../../helpers/hooks";
import { SightMarkCalculation, Status } from "../../../types";
import styles from "./MarksTable.module.css";

const MarksTable = () => {
  const { ballistics, getBallistics } = useFetchBallistics();
  const { status, calculateSightMarks, data, error } = useSightMarks();

  useEffect(() => {
    getBallistics();
  }, []);

  useEffect(() => {
    if (ballistics) {
      const sightMarkCalc: SightMarkCalculation = {
        distances: ballistics.given_distances,
        angles: [0],
        ballistics_pars: ballistics.ballistics_pars,
      };
      calculateSightMarks(sightMarkCalc);
    }
  }, [ballistics]);

  function renderMarksData() {
    if (status === Status.Pending) {
      return (
        <tr>
          <td colSpan={3}>
            <Skeleton height={10} mt={6} radius="xl" />
            <Skeleton height={10} mt={6} radius="xl" />
            <Skeleton height={10} mt={6} radius="xl" />
          </td>
        </tr>
      );
    }
    if (!data) {
      return (
        <tr>
          <td colSpan={3}>
            <Alert mt={8} icon={<AlertCircle size={16} />} title="Her var det tomt!" color="blue">
              Legg inn siktemerker og send dem inn til beregning
            </Alert>
          </td>
        </tr>
      );
    } else {
      return data.distances.map((distance, index) => (
        <tr key={index}>
          <td>{distance.toFixed(1)}m</td>
          <td>{data.sight_marks_by_hill_angle["0"][index].toFixed(2)}</td>
        </tr>
      ));
    }
  }

  return (
    <>
      <Table striped verticalSpacing="sm" fontSize="md">
        <thead>
          <tr>
            <td>
              <div className={styles.td}>
                <Ruler2 style={{ marginRight: 4 }} /> Avstand
              </div>
            </td>
            <td>
              <div className={styles.td}>
                <BorderOuter style={{ marginRight: 4 }} /> Merke
              </div>
            </td>
          </tr>
        </thead>
        <tbody>{renderMarksData()}</tbody>
      </Table>
    </>
  );
};

export default MarksTable;
