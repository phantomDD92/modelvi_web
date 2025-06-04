import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AgencyDashboardPage from "./pages/agency/AgencyDashboardPage";
import Layouts from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Verification from "./pages/auth/Verification";
import { useAuth } from "./contexts";
import { AdminRole } from "./utils/const";
import routes from "./routes/agencyRoutes";
import adminRoutes from "./routes/adminRoutes";

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
              element={route.component ? <Layouts>{route.component}</Layouts> : <AgencyDashboardPage />}
              path={route.path}
            />
          ))}
        {isAuthenticated && session?.role == AdminRole.MANAGER &&
          adminRoutes.map(route => (
            <Route
              key={route.key}
              exact
              element={route.component ? <Layouts>{route.component}</Layouts> : <AgencyDashboardPage />}
              path={route.path}
            />
          ))}
        {!isAuthenticated
          ? <Route key="landing" element={<HomePage />} exact path="/" />
          : session?.role == AdminRole.MANAGER
            ? <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            : <Route path="/" element={<Navigate to="/dashboard" replace />} />
        }
        <Route key="sign-in" element={<SignIn />} path="/sign-in" />
        <Route key="sign-up" element={<SignUp />} path="/sign-up" />
        <Route key="forgot-pass" element={<ForgotPassword />} path="/forgot-pass" />
        <Route key="verify" element={<Verification />} path="/verify" />
        <Route path="*" element={<Navigate to="/" />} />
        {/* {isAuthenticated && session?.role == AdminRole.MANAGER && } */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
