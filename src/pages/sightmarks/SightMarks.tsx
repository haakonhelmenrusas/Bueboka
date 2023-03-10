import React from "react";
import { Tabs } from "@mantine/core";
import { Markdown, Settings } from "tabler-icons-react";
import CalculateForm from "./calculateForm/CalculateForm";
import MarksTable from "./marksTable/MarksTable";

const SightMarks: React.FC = () => {
  return (
    <Tabs defaultValue="Innskyting" variant="outline">
      <Tabs.List>
        <Tabs.Tab value="Innskyting" icon={<Markdown size={14} />}>
          Innskyting
        </Tabs.Tab>
        <Tabs.Tab value="Siktemerker" icon={<Settings size={14} />}>
          Siktemerker
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="Innskyting" pt="xs">
        <CalculateForm />
      </Tabs.Panel>
      <Tabs.Panel value="Siktemerker" pt="xs">
        <MarksTable />
      </Tabs.Panel>
    </Tabs>
  );
};

export default SightMarks;