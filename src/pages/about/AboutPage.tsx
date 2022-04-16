import React from "react";
import { ColorScheme } from "@mantine/core";

import { AppContainer } from "../../components/common";
import Footer from "../../components/common/footer/Footer";
import styles from './AboutPage.module.css';

interface IAboutPage {
	colorScheme: ColorScheme;
	toggleColorScheme: () => void;
}

const AboutPage: React.FC<IAboutPage> = ({ colorScheme, toggleColorScheme }) => {


	return (
			<AppContainer colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<div className={styles.content}>
					<h2>Hei!</h2>
					<p>Hvem er vi og hva er egentlig Book of Arrows?</p>
				</div>
				<Footer />
			</AppContainer>
	);
};

export default AboutPage;
