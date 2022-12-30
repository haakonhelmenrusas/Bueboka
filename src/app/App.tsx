import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ColorScheme, ColorSchemeProvider, MantineProvider, Paper } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import StateProvider from "../helpers/StateProvider";
import { AboutPage, FormPage, LoginPage, UserPage } from "../pages";

const App = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = () => setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <>
      <BrowserRouter>
        <StateProvider>
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }}>
              <Paper>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route
                    path="user"
                    element={<UserPage colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />}
                  />
                  <Route
                    path="about"
                    element={<AboutPage colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />}
                  />
                  <Route
                    path="form"
                    element={<FormPage colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />}
                  />
                  <Route
                    path="*"
                    element={
                      <main style={{ padding: "1rem" }}>
                        <p>There is nothing here!</p>
                      </main>
                    }
                  />
                </Routes>
              </Paper>
            </MantineProvider>
          </ColorSchemeProvider>
        </StateProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
