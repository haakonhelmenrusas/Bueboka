import React from "react";
import {ColorScheme, Tabs} from "@mantine/core";
import { Markdown, Settings } from 'tabler-icons-react';

import { CalculateForm } from "../../components/";
import {AppContainer} from "../../components/common";

interface IFormPage {
	colorScheme: ColorScheme;
	toggleColorScheme: () => void;
}

const FormPage: React.FC<IFormPage> = ({ colorScheme, toggleColorScheme }) => {
	return (
		<AppContainer colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<Tabs variant="outline" tabPadding="md">
				<Tabs.Tab label="Siktemerker" icon={<Markdown size={14} />}>
					<CalculateForm/>
				</Tabs.Tab>
				<Tabs.Tab label="Beregn siktemerker" icon={<Settings size={14} />}>Settings tab content</Tabs.Tab>
			</Tabs>
		</AppContainer>
	);
};

export default FormPage;
