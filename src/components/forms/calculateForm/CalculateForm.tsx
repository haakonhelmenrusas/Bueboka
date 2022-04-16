import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, TextInput } from "@mantine/core";

import { AimDistanceInput } from "../../index";
import styles from './CalculateForm.module.css';

export interface IAimDistance {
	distance: string,
	mark: number;
}

const CalculateForm = () => {

	const form = useForm({
		initialValues: {
			aim: '',
			aimDistance: 0,
		},
	});

	const [aimDistanceInputs, setAimDistanceInputs] = useState<IAimDistance[]>([]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		form.onSubmit((values => console.log(values)))
		console.log("DATA SENT");
	};

	const addAimDistanceInput = () => {
		setAimDistanceInputs([...aimDistanceInputs, { distance: "", mark: 0 }]);
	}

	const handleChange = (index: number, event: any) => {
		let newFormValues = [...aimDistanceInputs];
		//newFormValues[index][event.currentTarget.] = event.target.value;
		setAimDistanceInputs(newFormValues);
	}

	const removeFormFields = (index: number) => {
		let newFormValues = [...aimDistanceInputs];
		newFormValues.splice(index, 1);
		setAimDistanceInputs(newFormValues)
	}

	return (
			<div>
				<h3>Siktemerker</h3>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.fieldGroup}>
						<TextInput className={styles.label} defaultValue={'10 m'} />
					</div>
					{aimDistanceInputs.map((input, index) => (
							<>
								<AimDistanceInput input={input} onchange={handleChange} key={index} />
								{
									index ?
											<button type="button" onClick={() => removeFormFields(index)}>Remove</button>
											: null
								}
							</>
					))}
					<Button onClick={addAimDistanceInput} variant="outline" type="button">
						&#43; Legg til siktemerke
					</Button>
					<Button className={styles.submitButton} type="submit">
						Send inn
					</Button>
				</form>
			</div>
	);
};

export default CalculateForm;
