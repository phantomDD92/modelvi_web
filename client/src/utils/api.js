import axios from "axios";
import toast from "react-hot-toast";
import { API_PATH } from "./const";
import { logoutManager } from "@/redux/dashboard/actions";

const postAction = async (dispatch, { action, path, data, params, inform, callback }) => {
    try {
        const { data: { success, message, payload } } = await axios.post(
            `${API_PATH}${path}`,
            data,
            { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params }
        );
        if (success) {
            action && dispatch({ type: action, payload: payload });
            inform && toast.success(inform);
            callback && callback()
            return payload;
        } else {
            toast.error(message);
            callback && callback()
            return undefined
        }
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(logoutManager());
        } else {
            toast.error("network failed");
        }
        callback && callback()
        return undefined
    }
}

const patchAction = async (dispatch, { action, path, data, params, inform, callback }) => {
    try {
        const { data: { success, message, payload } } = await axios.patch(
            `${API_PATH}${path}`,
            data,
            { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params }
        );
        if (success) {
            action && dispatch({ type: action, payload: payload });
            inform && toast.success(inform);
            callback && callback()
            return payload;
        } else {
            toast.error(message);
            callback && callback()
            return undefined
        }
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(logoutManager());
        } else {
            toast.error("network failed");
        }
        callback && callback()
        return undefined
    }
}

const getAction = async (dispatch, { action, path, params, callback, inform }) => {
    try {
        const { data: { success, message, payload } } = await axios.get(
            `${API_PATH}${path}`,
            {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                params
            }
        );
        if (success) {
            action && dispatch({ type: action, payload: payload });
            inform && toast.success(inform);
        } else {
            toast.error(message);
        }
        callback && callback();
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(logoutManager());
        } else {
            toast.error("network failed");
        }
        callback && callback();
    }
}

const putAction = async (dispatch, { action, path, data, params, inform, callback }) => {
    try {
        const { data: { success, message, payload } } = await axios.put(
            `${API_PATH}${path}`,
            data,
            { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params }
        );
        if (success) {
            action && dispatch({ type: action, payload: payload });
            inform && toast.success(inform);
        } else {
            toast.error(message);
        }
        callback && callback();
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(logoutManager());
        } else {
            toast.error("network failed");
        }
        callback && callback();
    }
}

const deleteAction = async (dispatch, { action, path, data, params, callback, inform }) => {
    try {
        const { data: { success, message, payload } } = await axios.delete(
            `${API_PATH}${path}`,
            {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                data,
                params,
            }
        );
        if (success) {
            action && dispatch({ type: action, payload: payload });
            inform && toast.success(inform);
        } else {
            toast.error(message);
        }
        callback && callback();
    } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
            dispatch(logoutManager());
        } else {
            toast.error("network failed");
        }
        callback && callback();
    }
}

export const ApiRequest = {
    getAction,
    postAction,
    deleteAction,
    putAction,
    patchAction,
}

export default ApiRequest