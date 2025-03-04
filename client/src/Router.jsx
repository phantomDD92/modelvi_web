import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import routes from "./routes";
import { useSelector } from "react-redux";
import Layouts from "./layouts/Layout";
import SignIn from "./pages/auth/sign-in";
import LandingPage from "./pages/Landing";

const Router = () => {
  const homeProps = useSelector(state => state.home);
  console.log("Token :", homeProps.token);
  return (
    <BrowserRouter>
      <Routes>
        {homeProps.token ?
          routes.filter(route => !route.visible || route.visible(homeProps.auth)).map(route => (
            <Route
              key={route.key}
              exact
              element={route.component ? <Layouts>{route.component}</Layouts> : <Home />}
              path={route.path}
            />
          )) : [
            // <Route key="landing" element={<LandingPage />} path="/" />
          ]}
        {/* } */}
        <Route key="login" element={<SignIn />} path="/auth/signin" />
        <Route key="landing" element={<LandingPage />} path="/landing" />
        {homeProps.token ? <Route path="*" element={<Navigate to="/dashboard" />} /> : <Route path="*" element={<Navigate to="/auth/signin" />} />}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
