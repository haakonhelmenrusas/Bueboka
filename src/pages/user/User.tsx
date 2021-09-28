import React, { useContext, useEffect, useState } from "react";

import { ArcherNumber, Button, Input, Layout } from "../../components";
import { useArcherNumber, useFetchArcher } from "../../helpers/hooks";
import { UserContext } from "../../helpers/StateProvider";
import styles from "./User.module.css";

const User = () => {
	const { user } = useContext(UserContext);
	const { writeArcherNumber } = useArcherNumber();
	const { value, getArcherNumber } = useFetchArcher();

	const [archerNumber, setArcherNumber] = useState<number | undefined>(
			undefined
	);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (archerNumber) {
			writeArcherNumber(archerNumber);
			setArcherNumber(undefined);
		}
	};

	const onChangeHandler = (event: any) => {
		event.preventDefault();
		const archerNumber: number = +event.target.value;
		setArcherNumber(archerNumber);
	};

	useEffect(() => {
		if (user.displayName) {
			getArcherNumber();
		}
	}, [getArcherNumber, user.displayName]);

	return (
			<Layout>
				<div className={styles.header}>
					<h2>Hei, {user.displayName}!</h2>
					<ArcherNumber archerNumber={value} />
				</div>
				<div className={styles.numberForm}>
					<p>Legg inn ditt skytternr</p>
					<form onSubmit={handleSubmit}>
						<Input
								onChange={onChangeHandler}
								labelName="Skytternr"
								name="skytternr"
								id="skytternr"
								type="text"
								style={{ width: 64 }}
						/>
						<Button type="submit" label="Lagre" buttonStyle="primary" />
					</form>
				</div>
			</Layout>
	);
};

export default User;
