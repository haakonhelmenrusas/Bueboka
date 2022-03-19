import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {InputGroup} from "react-bootstrap";

import styles from './CalculateForm.module.css';

const CalculateForm = () => {
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log("DATA SENT");
	};

	return (
			<div>
				<h3>Siktemerker</h3>
				<Form className={styles.form} onSubmit={handleSubmit}>
					<InputGroup className={styles.fieldGroup}>
						<InputGroup.Text className={styles.label}>5 m</InputGroup.Text>
						<Form.Control type="text"/>
					</InputGroup>
					<InputGroup className={styles.fieldGroup}>
						<InputGroup.Text className={styles.label}>10 m</InputGroup.Text>
						<Form.Control type="text"/>
					</InputGroup>
					<InputGroup className={styles.fieldGroup}>
						<InputGroup.Text className={styles.label}>15 m</InputGroup.Text>
						<Form.Control type="text"/>
					</InputGroup>
					<InputGroup className={styles.fieldGroup}>
						<InputGroup.Text className={styles.label}>20 m</InputGroup.Text>
						<Form.Control type="text"/>
					</InputGroup>
					<Button className={styles.submitButton} variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			</div>
	);
};

export default CalculateForm;
