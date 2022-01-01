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
      <StateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="user" element={<User />} />
            <Route path="form" element={<FormPage />} />
          </Routes>
        </BrowserRouter>
      </StateProvider>
    </div>
  );
};

export default App;
