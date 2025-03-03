import ACTIONS from "./types";
import ApiRequest from "@/utils/api";

export const clearProxies = (callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/proxy`,
    data: { action: "clear" },
    inform: "All proxies are successfully cleared",
    callback
  })
};

export const appendProxies = (proxies, deadline, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/proxy`,
    data: { proxies, deadline },
    inform: `${proxies.length} proxies are successfully appended`,
    callback
  })
};

export const loadProxies = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/proxy`,
    action: ACTIONS.LOAD_PROXIES,
    callback
  })
};

export const changeProxyStatus = (proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/proxy/${proxy._id}`,
    data: { action: "status", status },
    inform: `Proxy(${proxy.url}) is successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const changeBulkProxiesStatus = (proxyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/proxy`,
    data: { action: "status", status, proxyIds },
    inform: `${proxyIds.length} proxies are successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const deleteProxy = (proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/proxy/${proxy._id}`,
    inform: `Proxy(${proxy.url}) is successfully deleted`,
    callback
  })
};

export const deleteBulkProxies = (proxyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/proxy`,
    data: { proxyIds },
    inform: `${proxyIds.length} proxies are successfully deleted`,
    callback
  })
};
