import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import routes from "./routes";
import { useSelector } from "react-redux";
import Layouts from "./layouts/Layout";
import LoginPage from "./pages/auth/sign-in";
import LandingPage from "./pages/Landing";
import SignIn from "./pages/SignIn";

const Router = () => {
  const homeProps = useSelector(state => state.home);
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
        <Route key="login" element={<LoginPage />} path="/auth/signin" />
        <Route key="landing" element={<LandingPage />} path="/landing" />
        <Route key="signin" element={<SignIn />} path="/signin" />
        <Route key="signup" element={<SignIn />} path="/signup" />
        {homeProps.token ? <Route path="*" element={<Navigate to="/dashboard" />} /> : <Route path="*" element={<Navigate to="/auth/signin" />} />}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
