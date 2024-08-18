import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import routes from "./routes";
import { useSelector } from "react-redux";
import Layouts from "./layouts/Layout";
import SignIn from "./pages/auth/sign-in";

const Router = () => {
  const homeProps = useSelector(state => state.home);
  return (
    <BrowserRouter>
      <Routes>
        {homeProps.token ?
          routes.map(route => (
            <Route
              key={route.key}
              exact
              element={route.component ? <Layouts>{route.component}</Layouts> : <Home />}
              path={route.path}
            >
            </Route>
          )) : []}
        {/* } */}
        <Route key="login" element={<SignIn />} path="/auth/signin"></Route>
        {homeProps.token ? <Route path="*" element={<Navigate to="/dashboard" />} /> : <Route path="*" element={<Navigate to="/auth/signin" />} />}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
