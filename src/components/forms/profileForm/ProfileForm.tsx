import React, {useEffect, useState} from 'react';
import {Button, TextInput, Select} from "@mantine/core";
import { CircleX } from 'tabler-icons-react';

import {useArcherNumber, useBowType, useFetchArcher} from "../../../helpers/hooks";
import styles from "./ProfileForm.module.css";

interface IProfileForm {
	setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<IProfileForm> = ({ setShowEditForm }) => {
	const { value, getArcherNumber } = useFetchArcher();
	const { writeArcherNumber } = useArcherNumber();
	const { writeBowType } = useBowType();
	const [archerNumber, setArcherNumber] = useState<string>(value ? value : "");
	const [bowType, setBowType] = useState<{label: string, value: string}>({ label: "", value: "" });

	useEffect(() => {
		getArcherNumber();
	}, []);

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
					<CircleX aria-label="Lukk skjema" />
				</button>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<TextInput
							onKeyDown={(e: any) => !/\d/.test(e.key) && e.preventDefault()}
							required
							value={archerNumber}
							maxLength={6}
							onChange={handleArcherNumber}
							type="text"
							placeholder="F.eks. 2342"
							label="Skytternr."
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
