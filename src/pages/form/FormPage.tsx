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
			<Tabs variant="outline">
				<Tabs.List>
					<Tabs.Tab value="Siktemerker" icon={<Markdown size={14} />}>
						Siktemerker
					</Tabs.Tab>
					<Tabs.Tab value="Beregn siktemerker" icon={<Settings size={14} />}>Settings tab content</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="Siktemerker" pt="xs">
					<CalculateForm/>
				</Tabs.Panel>
				<Tabs.Panel value="Beregn siktemerker" pt="xs">
					Gallery tab content
				</Tabs.Panel>
			</Tabs>
		</AppContainer>
	);
};

export default FormPage;
