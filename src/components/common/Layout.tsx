import React from "react";
import { ColorScheme, ColorSchemeProvider, MantineProvider, Paper } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import { AppContainer } from "./index";

export default function Layout() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = () => setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Paper>
          <AppContainer colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <Outlet />
          </AppContainer>
        </Paper>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
