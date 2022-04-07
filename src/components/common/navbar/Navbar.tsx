import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@mantine/core";

import {logOut} from "../../../auth";
import styles from "./Navbar.module.css";


const Navbar = () => {

	return (
			<nav className={styles.nav}>
				<ul className={styles.list}>
					<li className={styles.li}>
						<NavLink to="/form">Sikteskjema</NavLink>
					</li>
					<li className={styles.li}>
						<Button onClick={logOut}>Logg ut</Button>
					</li>
				</ul>
			</nav>
	);
};

export default Navbar;
