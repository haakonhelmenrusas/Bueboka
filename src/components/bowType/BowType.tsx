import React from 'react';

import styles from './BowType.module.css';

interface IBowType {
	bowType: string | null;
}

const BowType: React.FC<IBowType> = ({ bowType }) => {
	if (bowType) {
		return (
				<div className={styles.container}>
					<svg className={styles.bowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
						<g transform="matrix(2,0,0,2,0,0)"><g>
							<path d="M20.34,5.79a2,2,0,0,0,1.45-1.45L22.5,1.5l-2.84.71a2,2,0,0,0-1.45,1.45L17.5,6.5Z" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<path d="M5.91,20.37a2.22,2.22,0,0,0,.59-1.51V17.5H5.09A2.27,2.27,0,0,0,3.64,18L.5,20.71l2.23.56L3,23.5Z" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<line x1="17.5" y1="6.5" x2="6.5" y2="17.5" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<path d="M3.39,4.29a2,2,0,0,1-2.3-.38,2,2,0,0,1,0-2.82A2,2,0,0,1,4.57,2.5" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<path d="M21.5,19.43a2.05,2.05,0,0,1,1.41,3.48,2,2,0,0,1-3.2-2.3" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<line x1="7.5" y1="21.5" x2="19.5" y2="21.5" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<line x1="2.5" y1="4.5" x2="2.5" y2="16.5" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<path d="M16.56,7.44,14.15,4.91a1.39,1.39,0,0,1-.4-1A1.43,1.43,0,0,0,12.32,2.5H2.5" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<path d="M21.5,21.5V11.9a1.4,1.4,0,0,0-1.4-1.4,1.41,1.41,0,0,1-1-.43L18,9" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<line x1="15.14" y1="12.36" x2="21.5" y2="18.71" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
							<line x1="5.29" y1="2.5" x2="13.39" y2="10.61" style={{ fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round" }}/>
						</g></g></svg>
					<p className={styles.bowType}>{bowType}</p>
				</div>
		)
	}
	else {
		return (
				<div className={styles.container}>
					<p>Ingen bue lagret</p>
				</div>
		)
	}
}
export default BowType;
