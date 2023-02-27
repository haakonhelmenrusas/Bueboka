import React from "react";
import { ActionIcon, ColorScheme } from "@mantine/core";
import { MoonStars, Sun } from "tabler-icons-react";

export interface ThemeToggleProps {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ colorScheme, toggleColorScheme }) => {
  return (
    <ActionIcon data-testid="action-icon" onClick={toggleColorScheme}>
      {colorScheme === "dark" ? <Sun data-testid="sun-icon" /> : <MoonStars data-testid="moon-stars-icon" />}
    </ActionIcon>
  );
};

export default ThemeToggle;
