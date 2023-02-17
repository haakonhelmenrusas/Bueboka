import React, { forwardRef } from "react";
import { Group, Text } from "@mantine/core";
import { Bow } from "tabler-icons-react";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(function SelectItem(
  { image, label, description, ...others }: ItemProps,
  ref
) {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Bow size={14} />
        <div>
          <Text>{label}</Text>
        </div>
      </Group>
    </div>
  );
});
