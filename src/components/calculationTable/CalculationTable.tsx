import React, {useMemo} from "react";
import {UseFormReturnType} from "@mantine/form";
import {AlertCircle, BorderOuter, Calculator, Ruler2, Trash} from "tabler-icons-react";
import {ActionIcon, Alert, Table} from "@mantine/core";
import styles from './CalculationTable.module.css';
import {CalculatedMarks} from "../../models";

interface ICalculationTable {
  form:  UseFormReturnType<{marks: never[]}>;
  ballistics: CalculatedMarks | null;
  getBallistics: () => void;
}

const CalculationTable = ({ form, ballistics, getBallistics }: ICalculationTable) => {

  const handleRemoveMark = async (index: number) => {
    form.removeListItem('marks', index);
    await getBallistics();
  }

  const renderBallisticTable = useMemo(() => {
    if (ballistics) {
      return (
        ballistics.given_distances.map((distance, index) => (
          <tr key={index}>
            <td>{distance.toFixed(2)}</td>
            <td>{ballistics.given_marks[index]}</td>
            <td>{ballistics.calculated_marks[index].toFixed(2)}</td>
            <td>
              <ActionIcon
                title="Fjern merke"
                style={{ marginLeft: "auto" }}
                color="red"
                variant="outline"
                onClick={() => handleRemoveMark(index)}
              >
                <Trash size={16} />
              </ActionIcon>
            </td>
          </tr>
        )))
    } else {
      return (
       <tr>
         <td colSpan={3}>
           <Alert mt={8} icon={<AlertCircle size={16} />} title="Her var det tomt!" color="blue">
             Legg inn siktemerker og send dem inn til beregning
           </Alert>
         </td>
       </tr>
      )
    }
}, [ballistics]);

  return (
    <>
      <Table striped verticalSpacing="sm" fontSize="md">
        <thead>
        <tr>
          <td><div className={styles.td}><Ruler2 style={{ marginRight: 4}} /> Avstand</div></td>
          <td><div className={styles.td}><BorderOuter style={{ marginRight: 4}} /> Merke</div></td>
          <td><div className={styles.td}><Calculator style={{ marginRight: 4}} /> Beregnet</div></td>
        </tr>
        </thead>
        <tbody>
          {renderBallisticTable}
        </tbody>
      </Table>
    </>
  )
}

export default CalculationTable;
