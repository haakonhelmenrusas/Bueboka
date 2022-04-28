import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

import { UserContext } from "../../helpers/StateProvider";
import { googleLogin } from "../../auth";
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
					<h2>Velkommen!</h2>
					<p>Vi gir deg</p>
					<ul className={styles.list}>
						<li>skytterprofil der du kan large skytternr. og data om ditt utstyr</li>
						<li>beregnet siktemerker med avansert beregningsmodell</li>
					</ul>
					<div className={styles.loginContainer}>
						{/*<Button onClick={facebookLogin}>Logg in med Facebook</Button>*/}
						<Button onClick={googleLogin}>Logg in med Google</Button>
					</div>
				</div>
			</>
	);
};

export default Login;
