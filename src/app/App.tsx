import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ColorScheme, ColorSchemeProvider, MantineProvider, Paper} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";

import StateProvider from "../helpers/StateProvider";
import FormPage from "../pages/form/FormPage";
import Login from "../pages/login/Login";
import User from "../pages/user/User";
import AboutPage from "../pages/about/AboutPage";

const App = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <BrowserRouter>
        <StateProvider>
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }}>
              <Paper>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="user" element={<User colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />} />
                  <Route path="about" element={<AboutPage colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />} />
                  <Route path="form" element={<FormPage colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />} />
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
