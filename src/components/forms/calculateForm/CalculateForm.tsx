import React, {useEffect, useState} from "react";
import {formList, useForm} from "@mantine/form";
import {AlertCircle, Plus, Trash} from 'tabler-icons-react';
import {Button, TextInput, Table, ActionIcon, Alert} from "@mantine/core";

import styles from './CalculateForm.module.css';

export interface IAimDistance {
	aim: string,
	distance: string;
}

const CalculateForm = () => {

	const form = useForm({
		initialValues: {
			marks: formList<IAimDistance>([]),
		},
	});

	const [aimValue, setAimValue] = useState<string>('');
	const [distanceValue, setDistanceValue] = useState<string>('');

	const sendMarks = async (marks: IAimDistance[]) => {
		const body = {
			"marks": [...marks.map((mark) => parseFloat(mark.aim))],
			"distances": [...marks.map((mark) => parseFloat(mark.distance))]
		}
		try {
			const res = await fetch('https://calculate-aim.azurewebsites.net/api/archerAim', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			const repo = await res.json();
			console.log("YEAH: ", repo)
		} catch (error) {
			console.log("NOT WIRKING: ", error)
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

	return (
		<div>
			<h3>Siktemerker</h3>
			<form className={styles.form}>
				<TextInput onChange={handleDistanceChange} className={styles.label} name="aimDistance" label="Avstand" />
				<TextInput onChange={handleAimChange} className={styles.label} name="aim" label="Merke" />
				<Button onClick={() => form.addListItem('marks', { aim: aimValue, distance: distanceValue })} type="button">
					<Plus />  Legg til
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
								<td>
									<ActionIcon
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
