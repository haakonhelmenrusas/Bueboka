import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import styles from './Form.module.css';

const CalculateForm = () => {
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const data = event.currentTarget;
		console.log("DATA SENT", data);
	};

	const handleAimTarget1 = (event: any) => {
		console.log(event.target.value)
	}

	return (
			<div>
				<h3>Siktemerker</h3>
				<Form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.section}>
						<Form.Group className={styles.formGroup} controlId="aimTarget1">
							<Form.Label>5 m</Form.Label>
							<Form.Control onChange={handleAimTarget1} type="text"/>
						</Form.Group>
						<Form.Group className={styles.formGroup} controlId="aimTarget2">
							<Form.Label>10 m</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
						<Form.Group className={styles.formGroup} controlId="aimTarget3">
							<Form.Label>15 m</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
						<Form.Group className={styles.formGroup} controlId="aimTarget4">
							<Form.Label>20 m</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
					</div>
					<div className={styles.section}>
					</div>
					<Button style={{width: 200}} variant="primary" type="submit">
						Send inn
					</Button>
				</Form>
			</div>
	);
};

export default CalculateForm;
