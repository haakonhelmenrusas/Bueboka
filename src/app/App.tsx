import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import StateProvider from "../helpers/StateProvider";
import FormPage from "../pages/form/FormPage";
import Login from "../pages/login/Login";
import User from "../pages/user/User";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <StateProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="user" element={<User />} />
            <Route path="form" element={<FormPage />} />
            <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There is nothing here!</p>
                  </main>
                }
            />
          </Routes>
        </StateProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
