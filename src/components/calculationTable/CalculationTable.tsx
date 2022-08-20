import React from "react";
import {BorderOuter, Calculator, Ruler2, Trash} from "tabler-icons-react";
import {ActionIcon, Button, Loader, Table} from "@mantine/core";

import {useFetchBallistics} from "../../helpers/hooks";
import {Status} from "../../models";

interface ICalculationTable {
  form: any;
}

const CalculationTable = ({ form }: ICalculationTable) => {

  const { ballistics, getBallistics } = useFetchBallistics();
  console.log("BALL DATA: ", ballistics)
  const renderCalculatedMarks = (index: number) => {
    if (ballistics?.calculated_marks) {
      return ballistics.calculated_marks[index].toFixed(2)
    }
  }

  const renderGivenMark = (index: number) => {
    if (ballistics) {
      return <td>{ballistics.given_marks[index]}</td>
    }
  }

  return (
    <>
      <Button onClick={() => getBallistics()} type="button">
        Hent tall
      </Button>
      <Table striped verticalSpacing="sm" fontSize="md">
        <thead>
        <tr>
          <td><Ruler2 /> Avstand</td>
          <td><BorderOuter /> Merke</td>
          <td><Calculator /> Beregnet</td>
        </tr>
        </thead>
        <tbody>
        {ballistics ? ballistics.given_distance.map((distance, index) => (
          <tr key={index}>
            <td>{distance.toFixed(2)}</td>
            <td>{renderGivenMark(index)}</td>
            <td>{status === Status.Pending ? <Loader size={16} /> : renderCalculatedMarks(index)}</td>
            <td>
              <ActionIcon
                title="Fjern merke"
                style={{ marginLeft: "auto" }}
                color="red"
                variant="outline"
                onClick={() => form.removeListItem('marks', index)}
              >
                <Trash size={16} />
              </ActionIcon>
            </td>
          </tr>
        )): (
          <tr><td>No what??</td></tr>
        )}
        </tbody>
      </Table>
    </>
  )
}

export default CalculationTable;
