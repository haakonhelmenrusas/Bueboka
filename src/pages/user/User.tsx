import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";

import {useArcherNumber, useFetchArcher} from "../../helpers/hooks";
import {Layout, ProfileImage} from "../../components/common";
import {UserContext} from "../../helpers/StateProvider";
import {ArcherNumber} from "../../components";
import firebaseApp from "../../auth";
import styles from "./User.module.css";

const User = () => {
	const navigate = useNavigate();
	const auth = getAuth(firebaseApp);
	const {user} = useContext(UserContext);
	const {writeArcherNumber, status} = useArcherNumber();
	const {value, getArcherNumber} = useFetchArcher();

	const [archerNumber, setArcherNumber] = useState<string | undefined>(undefined);
	const [showEditForm, setShowEditForm] = useState<boolean>(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (archerNumber) {
			writeArcherNumber(parseInt(archerNumber));
			if (status === "success") {
				setArcherNumber(undefined);
			}
		}
	};

	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setArcherNumber(event.target.value);
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
					<div className={styles.headerContent}>
						<h2>Hei, {user.displayName}!</h2>
						<Button
								onClick={() => setShowEditForm((state) => !state)}
								variant={showEditForm ? "outline-dark" : "primary"}>{showEditForm ? "Lukk skjema" : "Rediger profil"}
						</Button>
					</div>
					<div className={styles.profileData}>
						<ProfileImage
								photoURL={auth.currentUser ? auth.currentUser.photoURL ? auth.currentUser.photoURL : "" : ""}/>
						<ArcherNumber archerNumber={value}/>
					</div>
				</div>
				{showEditForm && (
						<div className={styles.numberForm}>
							<p>Legg inn ditt skytternr</p>
							<Form onSubmit={handleSubmit}>
								<Form.Group className="mb-3" controlId="formBasicNumber">
									<Form.Control
											onKeyPress={(e) => !/\d/.test(e.key) && e.preventDefault()}
											required
											value={archerNumber}
											maxLength={6}
											onChange={onChangeHandler}
											type="text"
											placeholder="Skytternr."
									/>
								</Form.Group>
								<Button disabled={status === "pending"} type="submit" variant="primary">Lagre</Button>
							</Form>
						</div>
				)}
			</Layout>
	);
};

export default User;
