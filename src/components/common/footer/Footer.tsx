import React from 'react';

import ArticBueLogo from "../../../assets/images/arcticBueLogo.png";
import styles from "./Footer.module.css";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<p>&copy; Helmen Design</p>
			</div>
			<span className={styles.divider}/>
			<div className={styles.sponsor}>
				<h4>Sponsor</h4>
				<a title="Gå til Arctic Buesport" href="https://arcticbuesport.no/" target="_blank" rel="noreferrer" >
					<img className={styles.logo} src={ArticBueLogo} alt="Arctic Buesport AS Logo" />
				</a>
			</div>
		</footer>
	)
}

export default Footer;
