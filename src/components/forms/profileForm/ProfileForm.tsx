import React, { useState } from 'react';
import {Bow, Hash} from "tabler-icons-react";
import {Button, TextInput, Select, Modal} from "@mantine/core";

import { useArcherNumber, useBowType } from "../../../helpers/hooks";
import { Status } from "../../../models";
import styles from "./ProfileForm.module.css";

interface IProfileForm {
	bowType: string | null;
	archerNumber: string | null;
	showEditForm: boolean;
	setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<IProfileForm> = ({ bowType, archerNumber, showEditForm, setShowEditForm }) => {
	const { writeBowType } = useBowType();
	const { status, writeArcherNumber } = useArcherNumber();

	const [archerNum, setArcherNum] = useState<string>(archerNumber ? archerNumber : "");
	const [bow, setBowType] = useState<string>(bowType ? bowType : "");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (archerNum) {
			writeArcherNumber(parseInt(archerNum));
		}
		if (bow) {
			writeBowType(bow);
		}
		setShowEditForm((state) => !state);
	};

	const handleArcherNumber = (event: any)=> {
		setArcherNum(event.currentTarget.value);
	};
	const handleBowType = (bowType: string) => {
		setBowType(bowType);
	};

	return (
		<Modal title="Rediger profil" opened={showEditForm} centered onClose={() => setShowEditForm(false)} className={styles.numberForm}>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<TextInput
						key={archerNum}
						icon={<Hash size={14} />}
						className="mb-3"
						value={archerNum}
						maxLength={6}
						onChange={handleArcherNumber}
						type="tel"
						placeholder="F.eks. 2342"
						label="Skytternr."
					/>
					<Select
						value={bow}
						icon={<Bow size={14} />}
						onChange={handleBowType}
						placeholder="Velg din buetype"
						aria-label="Bow type select"
						data={[
							'Compound',
							'Recurve' ,
							'Barebow' ,
							'Tradisjonell' ,
							'Langbue' ,
							'Annet' ,
						]}
					/>
				</div>
				<Button
					className={styles.button}
					loading={status === Status.Pending}
					type="submit"
				>Lagre</Button>
			</form>
		</Modal>
	)
}

export default ProfileForm;
