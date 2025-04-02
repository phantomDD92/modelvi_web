import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import routes from "./routes";
import Layouts from "./layouts/Layout";
import LoginPage from "./pages/auth/sign-in";
import LandingPage from "./pages/Landing";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { useAuth } from "./contexts";

const Router = () => {
  const { isAuthenticated, session } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated &&
          routes.filter(route => !route.visible || route.visible(session?.role)).map(route => (
            <Route
              key={route.key}
              exact
              element={route.component ? <Layouts>{route.component}</Layouts> : <Home />}
              path={route.path}
            />
          ))}

        {/* } */}
        <Route key="login" element={<LoginPage />} path="/auth/signin" />
        <Route key="landing" element={<LandingPage />} path="/landing" />
        <Route key="sign-in" element={<SignIn />} path="/sign-in" />
        <Route key="sign-up" element={<SignUp />} path="/sign-up" />
        <Route key="forgot-pass" element={<ForgotPassword />} path="/forgot-pass" />
        <Route key="verify" element={<ForgotPassword />} path="/verify" />
        {isAuthenticated
          ? <Route path="*" element={<Navigate to="/dashboard" />} />
          : <Route path="*" element={<Navigate to="/landing" />} />}
        {/* {isAuthenticated && <Route path="*" element={<Navigate to="/dashboard" />} />} */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
