import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { loginAgency, getProfile } from "@/redux/v2/actions";
import { useDispatch } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import { DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import toast from "react-hot-toast";

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
      const token = localStorage.getItem("token");
      if (token)
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
        if (payload.needVerify) {
          toast.success("Please verify your email");
          callback && callback(false);
        } else {
          localStorage.setItem("token", payload.token);
          const session = jwtDecode(payload.token);
          setSession(session);
          callback && callback(true);
        }
      } else {
        localStorage.removeItem("token", payload.token);
        setSession();
        setAuth();
        callback && callback(false);
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

