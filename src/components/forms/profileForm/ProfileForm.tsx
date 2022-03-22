import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";

import {useArcherNumber, useBowType} from "../../../helpers/hooks";
import styles from "./ProfileForm.module.css";

interface IProfileForm {
	setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<IProfileForm> = ({ setShowEditForm }) => {
	const { writeArcherNumber } = useArcherNumber();
	const { writeBowType } = useBowType();
	const [archerNumber, setArcherNumber] = useState<string>("");
	const [bowType, setBowType] = useState<string>("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (archerNumber) {
			writeArcherNumber(parseInt(archerNumber)).then(() => {
				setArcherNumber("");
			});
		}
		if (bowType) {
			writeBowType(bowType);
		}
		setShowEditForm((state) => !state);
	};

	const handleArcherNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setArcherNumber(event.target.value);
	};
	const handleBowType = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setBowType(event.target.value);
	};

	return (
		<div className={styles.numberForm}>
			<div className={styles.header}>
				<h3 className={styles.formTitle}>Rediger profil</h3>
				<button onClick={() => setShowEditForm((state) => !state)}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<g transform="matrix(1,0,0,1,0,0)">
							<title>Lukk skjema</title>
							<line className={styles.lineStroke} x1="7" y1="16.999" x2="17" y2="6.999"/>
							<line className={styles.lineStroke} x1="17" y1="16.999" x2="7" y2="6.999"/>
							<circle className={styles.lineStroke} cx="12" cy="11.999" r="11.5"/>
						</g>
					</svg>
				</button>
			</div>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="formBasicNumber">
					<Form.Text>Skytternr.</Form.Text>
					<Form.Control
							onKeyPress={(e) => !/\d/.test(e.key) && e.preventDefault()}
							required
							value={archerNumber}
							maxLength={6}
							onChange={handleArcherNumber}
							type="text"
							placeholder="F.eks. 2342"
					/>
					<Form.Text>Buetype</Form.Text>
					<Form.Select
						value={bowType}
						onChange={handleBowType}
						aria-label="Bow type select"
					>
						<option>Velg din buetype</option>
						<option value="Compound">Compound</option>
						<option value="Recurve">Recurve</option>
						<option value="Barebow">Barebow</option>
						<option value="Tradisjonell">Tradisjonell</option>
						<option value="Langbue">Langbue</option>
						<option value="Annet">Annet</option>
					</Form.Select>
				</Form.Group>
				<Button
					className={styles.button}
					disabled={status === "pending"}
					type="submit"
					variant="primary"
				>Lagre</Button>
			</Form>
		</div>
	)
}

export default ProfileForm;
