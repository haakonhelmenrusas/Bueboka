import React from "react";
import {getAuth} from "firebase/auth";
import {Link} from "react-router-dom";

import Logo from "../../../assets/images/logo512.png";
import Navbar from "../navbar/Navbar";
import firebaseApp from "../../../auth/";
import styles from "./Header.module.css";

const Header = () => {
	const auth = getAuth(firebaseApp);
	const userId = auth.currentUser;

	return (
			<header className={styles.header}>
				<div className={styles.brand}>
					<Link title="Profil" to="/user">
						<img className={styles.logo} src={Logo} alt="Logo"/>
						<h1 className={styles.title}>Book of Arrows</h1>
					</Link>
				</div>
				{userId && (
						<Navbar/>
				)}
			</header>
	);
};

export default Header;
