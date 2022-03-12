import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import styles from './Form.module.css';

const CalculateForm = () => {
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log("DATA SENT");
	};

	return (
			<div>
				<h3>Siktemerker</h3>
				<Form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.section}>
						<Form.Group className="mb-2" controlId="formBasicMalA">
							<Form.Label>Mål A</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
						<Form.Group className="m-3" controlId="formBasicMalB">
							<Form.Label>Mål B</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
					</div>
					<div className={styles.section}>
						<Form.Group className="mb-3" controlId="formBasicMalA">
							<Form.Label>Mål A</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicMalB">
							<Form.Label>Mål B</Form.Label>
							<Form.Control type="text"/>
						</Form.Group>
					</div>
					<Button style={{width: 200}} variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			</div>
	);
};

export default CalculateForm;
