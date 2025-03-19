import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { deleteCookie, hasCookie, getCookie, setCookie } from "cookies-next";
import { loginAgency, refreshToken } from "@/redux/v2/actions";
import { useDispatch } from "react-redux";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [session, setSession] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(refreshToken((payload) => {
        if (payload) {
          console.log(payload);
          setSession(payload.auth);
        } else {
          setSession()
          localStorage.removeItem("token");
        }
      }))
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setSession();
  };

  const login = (params) => {
    console.log("HERE", params);
    dispatch(loginAgency(params, (payload) => {
      if (payload) {
        localStorage.setItem("token", payload.token);
        setSession(payload.auth)
      } else {
        localStorage.removeItem("token", payload.token);
        setSession();
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

