import React, {useEffect, useState} from "react";
import {formList, useForm} from "@mantine/form";
import {AlertCircle, Plus, Trash, AlertTriangle} from 'tabler-icons-react';
import {ActionIcon, Alert, Button, Loader, Table, TextInput} from "@mantine/core";

import {IAimDistanceMark, IAimDistanceMarkValue, ICalculatedMarks, Status} from "../../../models";
import {useAimMarks} from "../../../helpers/hooks/";
import styles from './CalculateForm.module.css';

const CalculateForm = () => {

	const form = useForm({
		initialValues: {
			marks: formList<IAimDistanceMarkValue>([]),
		},
	});

	const { status, error, sendAimMarks } = useAimMarks();
	const [aimValue, setAimValue] = useState<string>('');
	const [distanceValue, setDistanceValue] = useState<string>('');
	const [resultMarks, setResultMarks] = useState<ICalculatedMarks | undefined>();

	const sendMarks = async (marks: IAimDistanceMarkValue[]) => {
		const body: IAimDistanceMark = {
			marks: [...marks.map((mark) => parseFloat(mark.aim))],
			distances: [...marks.map((mark) => parseFloat(mark.distance))]
		}
		try {
			const aimMarkResponse = await sendAimMarks(body);
			if (aimMarkResponse) {
				setResultMarks(aimMarkResponse);
			}
		} catch (error) {
			console.log("NOT WORKING: ", error)
		}
	}

	useEffect(() => {
		if (form.values.marks.length > 1) {
			sendMarks(form.values.marks)
		}
	}, [form.values.marks])

	const handleDistanceChange = (event: React.FormEvent<HTMLInputElement>) => {
		setDistanceValue(event.currentTarget.value)
	};

	const handleAimChange = (event: React.FormEvent<HTMLInputElement>) => {
		setAimValue(event.currentTarget.value)
	};
	const handleAddMarks = () => {
		form.addListItem('marks', { aim: aimValue, distance: distanceValue })
		setAimValue('');
		setDistanceValue('');
	};

	const renderCalculatedMarks = (index: number) => {
		if (resultMarks?.calculated_marks) {
			if (resultMarks.calculated_marks.length === form.values.marks.length) {
				return resultMarks.calculated_marks[index].toFixed(2)
			}
		}
	}

	const renderDeviatonAlert = (index: number) => {
		if (resultMarks?.calculated_marks) {
			if (resultMarks.marks_deviation[index] > 0.2) {
				return (
					<AlertTriangle color="orange" />
				)
			}
		}
	}

	return (
		<div>
			<h3>Siktemerker</h3>
			<form className={styles.form}>
				<TextInput value={distanceValue} onChange={handleDistanceChange} className={styles.label} name="aimDistance" label="Avstand" />
				<TextInput value={aimValue} onChange={handleAimChange} className={styles.label} name="aim" label="Merke" />
				<Button loading={status === Status.Pending} onClick={handleAddMarks} type="button">
					{status === Status.Pending ? 'Laster' : <> <Plus />  Legg til </>}
				</Button>
			</form>
				<Table>
					<thead>
						<tr>
							<td>Avstand</td>
							<td>Merke</td>
							<td>Beregnet</td>
						</tr>
					</thead>
					<tbody>
						{form.values.marks.length > 0 && form.values.marks.map((_, index) => (
							<tr key={index}>
								<td>{form.values.marks[index].distance}</td>
								<td>{form.values.marks[index].aim}</td>
								<td>{status === Status.Pending ? <Loader size={16} /> : renderCalculatedMarks(index)} {renderDeviatonAlert(index)}</td>
								<td>
									<ActionIcon
											style={{ marginLeft: "auto" }}
											color="red"
											variant="hover"
											onClick={() => form.removeListItem('marks', index)}
									>
										<Trash size={16} />
									</ActionIcon>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				{form.values.marks.length === 0 && (
					<Alert icon={<AlertCircle size={16} />} title="Bummer!" color="blue">
						Legg inn siktemerker og send dem inn til beregning
					</Alert>
				)}
		</div>
	);
};

export default CalculateForm;
