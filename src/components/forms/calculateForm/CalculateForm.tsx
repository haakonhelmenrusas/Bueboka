import React, { useEffect, useState } from "react";
import { formList, useForm } from "@mantine/form";
import { AlertCircle, Plus } from 'tabler-icons-react';
import { Alert, Button, Modal, NumberInput } from "@mantine/core";

import { IAimDistanceMark, IAimDistanceMarkValue, Status } from "../../../models";
import { useBallisticsParams, useStoreBallistics } from "../../../helpers/hooks/";
import styles from './CalculateForm.module.css';
import {CalculationTable} from "../../index";

const CalculateForm = () => {

	const form = useForm({
		initialValues: {
			marks: formList<IAimDistanceMarkValue>([]),
		},
	});

	const [opened, setOpened] = useState(false);
	const { status, calculateBallisticsParams } = useBallisticsParams();

	const { storeBallistics } = useStoreBallistics();
	const [aimValue, setAimValue] = useState<number>();
	const [aimError, setAimError] = useState(false);
	const [distanceError, setDistanceError] = useState(false);
	const [distanceValue, setDistanceValue] = useState<number>();

	const sendMarks = async (marks: IAimDistanceMarkValue[]) => {
		const body: IAimDistanceMark = {
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
		console.log(body)
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
		if (form.values.marks.length > 0) {
			sendMarks(form.values.marks).then(() => {
				//getBallistics();
			})
		}
	}, [form.values.marks])

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
			form.addListItem('marks', { aim: aimValue, distance: distanceValue })
			setAimValue(undefined);
			setDistanceValue(undefined);
		}
	};

/*	const renderDeviationAlert = (index: number) => {
		if (resultMarks?.calculated_marks) {
			const deviationValue = parseFloat(resultMarks.marks_deviation[index].toFixed(2));
			if (parseFloat(form.values.marks[index].aim) - deviationValue > 0.2 ||
				parseFloat(form.values.marks[index].aim) - deviationValue < -0.2) {
				console.log(deviationValue)
				return (
					<AlertTriangle onClick={() => setOpened(true)} color="orange" />
				)
			} else {
				return null;
			}
		}
	}*/

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<NumberInput
					min={0}
					max={100}
					hideControls
					placeholder="F.eks. 20m"
					value={distanceValue}
					noClampOnBlur
					onChange={handleDistanceChange}
					formatter={(value) => `${value}`.replace(/,/g, '.') }
					className={styles.label}
					name="aimDistance"
					label="Avstand"
					error={distanceError ? "Fyll inn avstanden først" : null}
					onFocus={() => setDistanceError(false)}
				/>
				<NumberInput
					min={0}
					max={15}
					placeholder="F.eks. 2.3"
					value={aimValue}
					noClampOnBlur
					hideControls
					onChange={handleAimChange}
					className={styles.label}
					name="aim"
					label="Merke"
					error={aimError ? "Fyll inn merke først" : null}
					onFocus={() => setAimError(false)}
				/>
				<Button loading={status === Status.Pending} onClick={handleAddMarks} type="button">
					{status === Status.Pending ? 'Laster' : <> <Plus />  Legg til </>}
				</Button>
			</form>
				<CalculationTable form={form} />
				{form.values.marks.length === 0 && (
					<Alert mt={8} icon={<AlertCircle size={16} />} title="Her var det tomt!" color="blue">
						Legg inn siktemerker og send dem inn til beregning
					</Alert>
				)}
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
