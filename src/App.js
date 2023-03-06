import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./assets/css/App.css";
import { APP_ROUTES } from "./utils/constants";
import Items from "./components/Items";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Navigate to={APP_ROUTES.DASHBOARD} />}
        />
        <Route path={APP_ROUTES.SIGN_UP} exact element={<SignUp />} />
        <Route path={APP_ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={`${APP_ROUTES.ITEMS}/:typeId`} element={<Items />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
