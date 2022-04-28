import React from "react";

import styles from "./ArcherNumber.module.css";

interface IArcherNumber {
	archerNumber: string | null;
}

const ArcherNumber = ({archerNumber}: IArcherNumber) => {
	return (
			<div className={styles.archerNumberContainer}>
				<p className={styles.title}>Skytternr</p>
				<span className={styles.number}>{archerNumber ? archerNumber : "- 0 -"}</span>
			</div>
	);
};

export default ArcherNumber;
