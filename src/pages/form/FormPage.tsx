import React from "react";
import { Tabs } from "@mantine/core";
import { Markdown } from "tabler-icons-react";
import { CalculateForm } from "../../components/";

const FormPage: React.FC = () => {
  return (
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
  );
};

export default FormPage;
