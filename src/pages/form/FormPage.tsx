import React from "react";
import {ColorScheme} from "@mantine/core";

import { CalculateForm } from "../../components/";
import {AppContainer} from "../../components/common";

interface IFormPage {
	colorScheme: ColorScheme;
	toggleColorScheme: () => void;
}

const FormPage: React.FC<IFormPage> = ({ colorScheme, toggleColorScheme }) => {
	return (
		<AppContainer colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<CalculateForm/>
		</AppContainer>
	);
};

export default FormPage;
