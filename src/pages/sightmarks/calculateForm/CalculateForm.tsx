import React, { useContext, useEffect, useState } from "react";
import { Calculator, Plus } from "tabler-icons-react";
import { Button, NumberInput } from "@mantine/core";
import { AimDistanceMark, MarkValue, Status } from "../../../types";
import { useBallisticsParams, useFetchBallistics, useStoreBallistics } from "../../../helpers/hooks";
import { useCalculateForm } from "./useCalculateForm";
import { Ballistics } from "../../../helpers/constants";
import { UserContext } from "../../../helpers/StateProvider";
import CalculationTable from "./calculationTable/CalculationTable";
import styles from "./CalculateForm.module.css";

const CalculateForm = () => {
  const { user } = useContext(UserContext);
  const [marks, setMarks] = useState<MarkValue[]>([]);
  const { storeBallistics } = useStoreBallistics();
  const { ballistics, getBallistics } = useFetchBallistics();
  const { status, error, calculateBallisticsParams } = useBallisticsParams();
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalculateForm();

  async function sendMarks(marks: MarkValue[]) {
    const body: AimDistanceMark = {
      ...Ballistics,
      marks: marks.map((mark) => mark.aim),
      given_distances: marks.map((mark) => mark.distance),
    };

    if (ballistics) {
      body.marks.push(...ballistics.given_marks);
      body.given_distances.push(...ballistics.given_distances);
    }
    try {
      const aimMarkResponse = await calculateBallisticsParams(body);
      if (aimMarkResponse) {
        await storeBallistics(aimMarkResponse);
        await getBallistics();
      }
    } catch (error) {
      console.log("NOT WORKING: ", error);
    }
  }

  function markCalculation() {
    sendMarks(marks);
  }

  function handleDistanceChange(value: number) {
    dispatch({ type: "SET_DISTANCE_VALUE", payload: value });
  }

  function handleAimChange(value: number) {
    dispatch({ type: "SET_AIM_VALUE", payload: value });
  }

  function handleAddMark() {
    if (!aimValue) {
      dispatch({ type: "SET_AIM_ERROR", payload: true });
    }
    if (!distanceValue) {
      dispatch({ type: "SET_DISTANCE_ERROR", payload: true });
    }
    if (aimValue && distanceValue) {
      const newEntry: MarkValue = { aim: aimValue, distance: distanceValue };
      setMarks([...marks, newEntry]);
      dispatch({ type: "SET_AIM_VALUE", payload: undefined });
      dispatch({ type: "SET_DISTANCE_VALUE", payload: undefined });
    }
  }

  async function handleRemoveMark(index: number) {
    if (ballistics) {
      ballistics.given_marks.splice(index, 1);
      ballistics.given_distances.splice(index, 1);
    }
  }

  useEffect(() => {
    getBallistics();
  }, [user]);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <NumberInput
          min={0}
          max={100}
          decimalSeparator="."
          precision={1}
          step={0.1}
          type="text"
          inputMode="decimal"
          hideControls
          placeholder="F.eks. 20"
          value={distanceValue}
          onChange={handleDistanceChange}
          parser={(value) => `${value}`.replace(/,/g, ".")}
          formatter={(value) => `${value}`.replace(/,/g, ".")}
          className={styles.label}
          name="aimDistance"
          label="Avstand"
          error={distanceError ? "Fyll inn avstand først" : null}
          onFocus={() => dispatch({ type: "SET_DISTANCE_ERROR", payload: false })}
        />
        <NumberInput
          min={0}
          max={15}
          type="text"
          inputMode="decimal"
          decimalSeparator="."
          precision={2}
          step={0.01}
          placeholder="F.eks. 2.35"
          value={aimValue}
          hideControls
          parser={(value) => `${value}`.replace(/,/g, ".")}
          formatter={(value) => `${value}`.replace(/,/g, ".")}
          onChange={handleAimChange}
          className={styles.label}
          name="aim"
          label="Merke"
          error={aimError ? "Fyll inn merke først" : null}
          onFocus={() => dispatch({ type: "SET_AIM_ERROR", payload: false })}
        />
        <Button className={styles.markButton} onClick={handleAddMark} type="button">
          <Plus /> Legg til{" "}
        </Button>
      </form>
      <Button
        className={styles.calcButton}
        fullWidth
        loading={status === Status.Pending}
        onClick={markCalculation}
        type="button"
      >
        {status === Status.Pending ? (
          "Jobber"
        ) : (
          <>
            {" "}
            <Calculator /> Beregn siktemerker{" "}
          </>
        )}
      </Button>
      <CalculationTable ballistics={ballistics} removeMark={handleRemoveMark} />
    </div>
  );
};

export default CalculateForm;
