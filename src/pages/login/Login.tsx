import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bow, BrandGoogle, ListCheck, UserCircle } from "tabler-icons-react";
import { Button, Card } from "@mantine/core";

import { UserContext } from "../../helpers/StateProvider";
import { googleLogin } from "../../auth";
import Logo from '../../assets/images/logo512.png';
import Footer from "../../components/common/footer/Footer";
import styles from "./Login.module.css";

const Login = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user.displayName) {
			navigate("/user");
		}
	}, [navigate, user]);

	return (
			<>
				<div className={styles.welcomeContainer}>
					<img className={styles.logo} alt="Logo" src={Logo} />
					<h1 className={styles.title}>Book of Arrows</h1>
					<div className={styles.list}>
						<Card radius={4} shadow="md" className={styles.listItem}>
							<UserCircle color="#228be6" size={40} />
							<p className={styles.listText}>Skytterprofil</p>
						</Card>
						<Card radius={4} shadow="md" className={styles.listItem}>
							<Bow color="#228be6" size={40} />
							<p className={styles.listText}>Register utstyr</p>
						</Card>
						<Card radius={4} shadow="md" className={styles.listItem}>
							<ListCheck color="#228be6" size={40} />
							<p className={styles.listText}>Beregning av siktemerker</p>
						</Card>
					</div>
					<h2 className={styles.subtitle}>Her samles Norges bueskyttere</h2>
					<h3 className={styles.subtitle}>Bli med!</h3>
					<Button leftIcon={<BrandGoogle />} onClick={googleLogin}>
						Logg inn med Google
					</Button>
				</div>
				<Footer />
			</>
	);
};

export default Login;
