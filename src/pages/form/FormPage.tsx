import React from "react";
import { ColorScheme, Tabs } from "@mantine/core";
import { Markdown } from "tabler-icons-react";

import { CalculateForm } from "../../components/";
import { AppContainer } from "../../components/common";

interface IFormPage {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const FormPage: React.FC<IFormPage> = ({ colorScheme, toggleColorScheme }) => {
  return (
    <AppContainer
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <Tabs defaultValue="Siktemerker" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="Siktemerker" icon={<Markdown size={14} />}>
            Siktemerker
          </Tabs.Tab>
          {/*<Tabs.Tab disabled value="Beregn siktemerker" icon={<Settings size={14} />}>Settings</Tabs.Tab>*/}
        </Tabs.List>
        <Tabs.Panel value="Siktemerker" pt="xs">
          <CalculateForm />
        </Tabs.Panel>
        <Tabs.Panel value="Beregn siktemerker" pt="xs">
          Gallery tab content
        </Tabs.Panel>
      </Tabs>
    </AppContainer>
  );
};

export default FormPage;
