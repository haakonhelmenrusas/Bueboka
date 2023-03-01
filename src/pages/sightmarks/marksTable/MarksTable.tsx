import React, { useEffect } from "react";
import { AlertCircle, BorderOuter, Ruler2 } from "tabler-icons-react";
import { Alert, Skeleton, Table } from "@mantine/core";
import Plot from "react-plotly.js";
import { useFetchBallistics, useSightMarks } from "../../../helpers/hooks";
import { SightMarkCalculation, Status } from "../../../types";
import styles from "./MarksTable.module.css";

const MarksTable = () => {
  const { ballistics, getBallistics } = useFetchBallistics();
  const { status, calculateSightMarks, data } = useSightMarks();

  useEffect(() => {
    getBallistics();
  }, []);

  useEffect(() => {
    if (ballistics) {
      const sightMarkCalc: SightMarkCalculation = {
        distances: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
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
    <div>
      <Table className={styles.table} striped verticalSpacing="sm" fontSize="md">
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
      {data && (
        <Plot
          className={styles.plot}
          data={[
            {
              x: [...data.distances],
              y: [...data.sight_marks_by_hill_angle["0"]],
              xaxis: "Lengder",
              yaxis: "Merker",
              type: "scatter",
              mode: "lines+markers",
            },
          ]}
          layout={{ title: "Siktemerker" }}
        />
      )}
    </div>
  );
};

export default MarksTable;
