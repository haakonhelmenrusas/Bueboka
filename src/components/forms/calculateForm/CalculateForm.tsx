import React, {useEffect, useState} from "react";
import { useForm } from "@mantine/form";
import { Plus } from 'tabler-icons-react';
import { Button, Modal, NumberInput } from "@mantine/core";
import { AimDistanceMark, AimDistanceMarkValue, Status } from "../../../models";
import { useBallisticsParams, useStoreBallistics } from "../../../helpers/hooks/";
import {CalculationTable} from "../../index";
import styles from './CalculateForm.module.css';
import {useFetchBallistics} from "../../../helpers/hooks";

const CalculateForm = () => {

	const form = useForm({
		initialValues: {
			marks: [],
		},
	});

	const { storeBallistics } = useStoreBallistics();
	const { ballistics, getBallistics } = useFetchBallistics()
	const { status, calculateBallisticsParams } = useBallisticsParams();

	const [opened, setOpened] = useState(false);
	const [aimError, setAimError] = useState(false);
	const [aimValue, setAimValue] = useState<number>();
	const [distanceError, setDistanceError] = useState(false);
	const [distanceValue, setDistanceValue] = useState<number>();

	const sendMarks = async (marks: AimDistanceMarkValue[]) => {
		const body: AimDistanceMark = {
			marks: [...marks.map((mark) => mark.aim)],
			given_distances: [...marks.map((mark) => mark.distance)],
			bow_category: "recurve",
			interval_sight_measured: 5.0,
			interval_sight_real: 5.3,
			arrow_diameter_mm: 5.69,
			arrow_mass_gram: 21.2,
			length_eye_sight_cm: 97.0,
			length_nock_eye_cm: 12.0,
			feet_behind_or_center: "behind"
		}

		if (ballistics) {
			body.marks.push(...ballistics.given_marks)
			body.given_distances.push(...ballistics.given_distances)
		}

		try {
			const aimMarkResponse = await calculateBallisticsParams(body);
			if (aimMarkResponse) {
				await storeBallistics(aimMarkResponse);
			}
		} catch (error) {
			console.log("NOT WORKING: ", error)
		}
	}

	useEffect(() => {
		// Get previous calculations from DB
		getBallistics();
	},[])

	const markCalculation = () => {
		if (form.values.marks.length > 0) {
			sendMarks(form.values.marks).then(async () => {
				setAimValue(undefined);
				setDistanceValue(undefined);
				await getBallistics();
			})
		}
	};

	const handleDistanceChange = (value: number) => {
		setDistanceValue(value)
	};

	const handleAimChange = (value: number) => {
		setAimValue(value)
	};

	const handleAddMarks = () => {
		if (!aimValue) {
			setAimError(true);
		}
		if (!distanceValue) {
			setDistanceError(true);
		}
		if (aimValue && distanceValue) {
			form.insertListItem('marks', { aim: aimValue, distance: distanceValue })
			markCalculation();
		}
	};

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<NumberInput
					min={0}
					max={100}
					type="text"
					hideControls
					placeholder="F.eks. 20"
					value={distanceValue}
					onChange={handleDistanceChange}
					parser={(value) => `${value}`.replace(/,/g, '.') }
					formatter={(value) => `${value}`.replace(/,/g, '.') }
					className={styles.label}
					name="aimDistance"
					label="Avstand"
					error={distanceError ? "Fyll inn avstand først" : null}
					onFocus={() => setDistanceError(false)}
				/>
				<NumberInput
					min={0}
					max={15}
					type="text"
					precision={1}
					placeholder="F.eks. 2.3"
					value={aimValue}
					hideControls
					parser={(value) => `${value}`.replace(/,/g, '.') }
					formatter={(value) => `${value}`.replace(/,/g, '.') }
					onChange={handleAimChange}
					className={styles.label}
					name="aim"
					label="Merke"
					error={aimError ? "Fyll inn merke først" : null}
					onFocus={() => setAimError(false)}
				/>
				<Button loading={status === Status.Pending} onClick={handleAddMarks} type="button">
					{status === Status.Pending ? 'Jobber' : <> <Plus />  Legg til </>}
				</Button>
			</form>
			<CalculationTable form={form} ballistics={ballistics} getBallistics={getBallistics} />
			{opened && (
				<>
					<Modal
						opened={opened}
						onClose={() => setOpened(false)}
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
