import React, {useContext, useEffect, useState} from "react";
import { Button } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";

import {useFetchArcher, useFetchBow} from "../../helpers/hooks";
import {Layout, ProfileImage} from "../../components/common";
import {UserContext} from "../../helpers/StateProvider";
import {ArcherNumber, BowType, ProfileForm} from "../../components";
import firebaseApp from "../../auth";
import styles from "./User.module.css";

const User = () => {
	const navigate = useNavigate();
	const auth = getAuth(firebaseApp);
	const { user } = useContext(UserContext);
	const { value, getArcherNumber } = useFetchArcher();
	const { bowType, getBow } = useFetchBow();
	const [showEditForm, setShowEditForm] = useState<boolean>(false);

	useEffect(() => {
		if (user.displayName) {
			getArcherNumber();
			getBow();
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
						<div className={styles.profileSpecs}>
							<ArcherNumber archerNumber={value}/>
							<BowType bowType={bowType} />
						</div>
					</div>
				</div>
				{showEditForm && (
					<ProfileForm setShowEditForm={setShowEditForm} />
				)}
			</Layout>
	);
};

export default User;
