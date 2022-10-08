import React from "react";
import { ActionIcon, ColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";

interface IThemeToggle {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const ThemeToggle: React.FC<IThemeToggle> = ({
  colorScheme,
  toggleColorScheme,
}) => {
  return (
    <ActionIcon onClick={toggleColorScheme}>
      {colorScheme === "dark" ? <Sun /> : <MoonStars />}
    </ActionIcon>
  );
};

export default ThemeToggle;
