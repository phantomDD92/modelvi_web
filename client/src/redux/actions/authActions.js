import axios from "axios";
import { toast } from "react-hot-toast";

export const register = (authData) => async (dispatch) => {
  try {
    const { data : {success, message, payload} } = await axios.post(
      `http://localhost:5000/register`,
      authData
    );
    dispatch({ type: "REGISTER", payload: data });
    window.location = "/";
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

export const login = (authData) => async (dispatch) => {
  try {
    const { data : {success, message, payload} } = await axios.post("http://localhost:5000/login", authData);
    dispatch({ type: "LOGIN", payload: data });
    window.location = "/";
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: "LOGOUT" });
  window.location = "/auth";
};
