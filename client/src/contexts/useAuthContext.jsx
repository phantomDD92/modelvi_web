import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { loginAgency, getProfile } from "@/redux/v2/actions";
import { useDispatch } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import { DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const dispatch = useDispatch();
  const [session, setSession] = useState();
  const [auth, setAuth] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { id, role, name } = jwtDecode(token);
      setSession({ id, role, name });
      dispatch(getProfile());
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getProfile());
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const logout = (callback) => {
    localStorage.removeItem("token");
    setSession();
    setAuth();
    callback && callback();
  };

  const login = (params, callback) => {
    dispatch(loginAgency(params, (payload) => {
      if (payload) {
        localStorage.setItem("token", payload.token);
        const session = jwtDecode(payload.token);
        setSession(session);
        callback && callback();
      } else {
        localStorage.removeItem("token", payload.token);
        setSession();
        setAuth();
      }
    }));
  }

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          login,
          logout,
          session,
          auth,
          isAuthenticated: localStorage.getItem("token") != undefined,
          role: session?.role,
        }),
        [session]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext)
};

