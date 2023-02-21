import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StateProvider from "../helpers/StateProvider";
import { AboutPage, LoginPage, SightMarks, UserPage } from "../pages";
import Layout from "../components/common/Layout";

const App = () => {
  return (
    <StateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="user" element={<UserPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="siktemerker" element={<SightMarks />} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There is nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </StateProvider>
  );
};

export default App;
