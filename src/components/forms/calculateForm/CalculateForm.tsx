import React, { useContext, useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";
import { Button, Modal, NumberInput } from "@mantine/core";
import { AimDistanceMark, AimDistanceMarkValue, Status } from "../../../models";
import { useBallisticsParams, useStoreBallistics } from "../../../helpers/hooks/";
import { CalculationTable } from "../../index";
import { useFetchBallistics } from "../../../helpers/hooks";
import { useCalculateForm } from "./useCalculateForm";
import { Ballistics } from "../../../helpers/constants";
import styles from "./CalculateForm.module.css";
import { UserContext } from "../../../helpers/StateProvider";

const CalculateForm = () => {
  const { user } = useContext(UserContext);
  const [marks, setMarks] = useState<AimDistanceMarkValue[]>([]);
  const { storeBallistics } = useStoreBallistics();
  const { ballistics, getBallistics } = useFetchBallistics();
  const { status, calculateBallisticsParams } = useBallisticsParams();
  const [{ opened, aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalculateForm();

  async function sendMarks(marks: AimDistanceMarkValue[]) {
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
    if (marks.length > 0) {
      sendMarks(marks).then(async () => {
        dispatch({ type: "SET_AIM_VALUE", payload: undefined });
        dispatch({ type: "SET_DISTANCE_VALUE", payload: undefined });
        await getBallistics();
      });
    }
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
      const newEntry: AimDistanceMarkValue = { aim: aimValue, distance: distanceValue };
      setMarks([...marks, newEntry]);
    }
  }

  async function handleRemoveMark(index: number) {
    if (ballistics) {
      ballistics.given_marks.splice(index, 1);
      ballistics.given_distances.splice(index, 1);
      await sendMarks([]);
    }
  }

  useEffect(() => {
    markCalculation();
  }, [marks.length]);

  useEffect(() => {
    getBallistics();
  }, [user, marks.length]);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <NumberInput
          min={0}
          max={100}
          decimalSeparator="."
          precision={1}
          type="text"
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
          precision={1}
          placeholder="F.eks. 2.3"
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
        <Button loading={status === Status.Pending} onClick={handleAddMark} type="button">
          {status === Status.Pending ? (
            "Jobber"
          ) : (
            <>
              {" "}
              <Plus /> Legg til{" "}
            </>
          )}
        </Button>
      </form>
      <CalculationTable ballistics={ballistics} removeMark={handleRemoveMark} />
      {opened && (
        <>
          <Modal
            opened={opened}
            onClose={() => dispatch({ type: "SET_OPENED", payload: false })}
            title="Stor avvik"
            centered
          >
            Her avviker siktemerket du har sendt inn med beregnet sikemerke.
          </Modal>
        </>
      )}
    </div>
  );
};

export default CalculateForm;
