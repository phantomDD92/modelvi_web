import { toast } from "react-hot-toast";
import ACTIONS from "./types";
import { logoutManager } from "../dashboard/actions";
import ApiRequest from "@/utils/api";

export const clearProxies = (callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/proxy`,
    inform: "successfully clear proxies",
    callback
  })
};

export const addProxies = (proxies, deadline, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch,{
    path: `/proxy`,
    data: { proxies, deadline },
    inform: "successfully add proxies",
    callback
  })
};

export const loadProxies = ({ page, pageSize }) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/proxy`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_PROXIES,
  })
};

export const setProxyStatus = (proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/proxy`,
    data: { id: proxy._id, status },
    inform: "successfully change proxy status",
    callback
  })
};


export const deleteProxy = (proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/proxy/${proxy._id}`,
    inform: "successfully remove proxy",
    callback
  })
};
