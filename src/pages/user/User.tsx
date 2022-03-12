import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

import {ArcherNumber} from "../../components";
import {Layout} from "../../components/common";
import {useArcherNumber, useFetchArcher} from "../../helpers/hooks";
import {UserContext} from "../../helpers/StateProvider";
import styles from "./User.module.css";
import {logOut} from "../../auth";

const User = () => {
	const {user} = useContext(UserContext);
	const {writeArcherNumber, status} = useArcherNumber();
	const navigate = useNavigate();
	const {value, getArcherNumber} = useFetchArcher();

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
		} else {
			navigate('/');
		}
	}, [getArcherNumber, user.displayName]);

	return (
			<Layout>
				<div className={styles.header}>
					<h2>Hei, {user.displayName}!</h2>
					<ArcherNumber archerNumber={value}/>
				</div>
				<div className={styles.numberForm}>
					<p>Legg inn ditt skytternr</p>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formBasicNumber">
							<Form.Control onChange={onChangeHandler} type="text" placeholder="Skytternr."/>
						</Form.Group>
						<Button disabled={status === "pending" ? true : false} type="submit" variant="primary">Lagre</Button>
					</Form>
				</div>
				<div>
					<Button variant="secondary" onClick={logOut}>Logg ut</Button>
				</div>
			</Layout>
	);
};

export default User;
