import React from "react";
import {getAuth} from "firebase/auth";
import {NavLink} from "react-router-dom";

import firebaseApp from "../../../auth";
import {ProfileImage} from "../index";
import styles from "./Navbar.module.css";

const Navbar = () => {
	const auth = getAuth(firebaseApp);

	return (
			<nav className={styles.nav}>
				<ul className={styles.list}>
					<li className={styles.li}>
						<NavLink to="/form">Sikteskjema</NavLink>
					</li>
					<li className={styles.profileNav}>
						<NavLink title="Profil" to="/user">
							<ProfileImage
									photoURL={auth.currentUser ? auth.currentUser.photoURL ? auth.currentUser.photoURL : "" : ""}/>
						</NavLink>
					</li>
				</ul>
			</nav>
	);
};

export default Navbar;
