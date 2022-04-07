import React, { useState } from 'react';
import {Button, Input, Select} from "@mantine/core";

import {useArcherNumber, useBowType} from "../../../helpers/hooks";
import styles from "./ProfileForm.module.css";

interface IProfileForm {
	setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<IProfileForm> = ({ setShowEditForm }) => {
	const { writeArcherNumber } = useArcherNumber();
	const { writeBowType } = useBowType();
	const [archerNumber, setArcherNumber] = useState<string>("");
	const [bowType, setBowType] = useState<{label: string, value: string}>({ label: "", value: "" });

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (archerNumber) {
			writeArcherNumber(parseInt(archerNumber)).then(() => {
				setArcherNumber("");
			});
		}
		if (bowType) {
			writeBowType(bowType.value);
		}
		setShowEditForm((state) => !state);
	};

	const handleArcherNumber = (event: any)=> {
		setArcherNumber(event.target.value);
	};
	const handleBowType = (bowType: any) => {
		setBowType(bowType);
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
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<Input
							onKeyPress={(e: any) => !/\d/.test(e.key) && e.preventDefault()}
							required
							value={archerNumber}
							maxLength={6}
							onChange={handleArcherNumber}
							type="text"
							placeholder="F.eks. 2342"
					/>
					<Select
						value={bowType.value}
						onChange={handleBowType}
						placeholder="Velg din buetype"
						aria-label="Bow type select"
						data={[
							{ value: 'Compound', label: 'Compound' },
							{ value: 'Recurve', label: 'Recurve' },
							{ value: 'Barebow', label: 'Barebow' },
							{ value: 'Tradisjonell', label: 'Tradisjonell' },
							{ value: 'Langbue', label: 'Langbue' },
							{ value: 'Annet', label: 'Annet' },
						]}
					/>
				</div>
				<Button
					className={styles.button}
					disabled={status === "pending"}
					type="submit"
				>Lagre</Button>
			</form>
		</div>
	)
}

export default ProfileForm;
