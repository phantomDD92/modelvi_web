import ApiRequest from "@/utils/api";
import ACTIONS from "./types";

export const loadAffiliatesForAdmin = (time = "day", callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/affiliate`,
    params: { time },
    action: ACTIONS.LOAD_AFFILIATES,
    callback
  })
}

// proxy related actions
export const loadProxiesForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/proxy`,
    action: ACTIONS.LOAD_PROXIES,
    callback
  })
};

export const clearAllProxiesForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy`,
    inform: `all proxies are successfully deleted.`,
    callback
  })
};

export const loadAgencyProxiesForAdmin = (agencyId, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    action: ACTIONS.LOAD_AGENCY_PROXIES,
    callback
  })
};

export const appendAgencyProxiesForAdmin = (agencyId, proxies, deadline, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { proxies, deadline },
    callback
  })
};

export const clearAgencyProxiesForAdmin = (agencyId, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { action: "clear" },
    inform: `agency's proxies are successfully deleted`,
    callback
  })
};

export const changeProxyStatusForAdmin = (agencyId, proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}/${proxy._id}`,
    data: { action: "status", status },
    inform: `Proxy(${proxy.url}) is successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const changeBulkProxiesStatusForAdmin = (agencyId, proxyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { action: "status", status, proxyIds },
    inform: `${proxyIds.length} proxies are successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const deleteProxyForAdmin = (agencyId, proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}/${proxy._id}`,
    inform: `Proxy(${proxy.url}) is successfully deleted`,
    callback
  })
};

export const resetProxyForAdmin = (agencyId, proxy, platform, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}/${proxy._id}`,
    data: { action: 'reset', platform },
    inform: `Proxy(${proxy.url}) is successfully reset`,
    callback
  })
};

export const deleteBulkProxiesForAdmin = (agencyId, proxyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { proxyIds },
    inform: `${proxyIds.length} proxies are successfully deleted`,
    callback
  })
};


export const loadAgenciesForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/agency`,
    action: ACTIONS.LOAD_AGENCIES,
    callback,
  })
};