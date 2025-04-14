import ApiRequest from "@/utils/api";
import ACTIONS from "./types";

export const registerAgency = (params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/auth`,
    data: params,
    inform: `Agency(${params.name}) is successfully registerd.`,
    callback
  })
};

export const loginAgency = (params, callback) => async (dispatch) => {
  const payload = await ApiRequest.postAction(dispatch, {
    path: `/v2/auth`,
    action: ACTIONS.LOAD_PROFILE,
    data: params,
  })
  callback && callback(payload);
};

export const getProfile = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/profile`,
    action: ACTIONS.LOAD_PROFILE,
    callback,
  })
};


export const createPayment = (currency, callback) => async (dispatch) => {
  try {
    const payload = await ApiRequest.postAction(dispatch, {
      path: `/v2/agency/payment`,
      data: { currency },
      action: ACTIONS.GET_PAYMENT,
    })
    callback && callback(payload.payment?._id);
  } catch (error) {
    callback && callback();
  }

}

export const loadPayments = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/payment`,
    action: ACTIONS.LOAD_PAYMENTS,
    callback,
  })
}

export const cancelPayment = (paymentID, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/payment/${paymentID}`,
    inform: `Payment is canceled`,
    callback,
  })
}

export const getPayment = (paymentID, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/payment/${paymentID}`,
    action: ACTIONS.GET_PAYMENT,
    callback,
  })
}

export const loadTransactions = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/transaction`,
    action: ACTIONS.LOAD_TRANSACTIONS,
    callback,
  })
}

export const getAffiliate = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/affiliate`,
    action: ACTIONS.GET_AFFILIATE,
    callback,
  })
}

export const setAffiliateClick = (referralCode) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/affiliate`,
    data: { referralCode }
  })
}

export const setAffiliateRegistration = (referralCode) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/affiliate`,
    data: { referralCode }
  })
}

export const clearProxies = (callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { action: "clear" },
    inform: "All proxies are successfully cleared",
    callback
  })
};

export const appendProxies = (proxies, deadline, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { proxies, deadline },
    inform: `${proxies.length} proxies are successfully appended`,
    callback
  })
};

export const loadProxies = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/proxy`,
    action: ACTIONS.LOAD_PROXIES,
    callback
  })
};

export const changeProxyStatus = (proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy/${proxy._id}`,
    data: { action: "status", status },
    inform: `Proxy(${proxy.url}) is successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const changeBulkProxiesStatus = (proxyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { action: "status", status, proxyIds },
    inform: `${proxyIds.length} proxies are successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const deleteProxy = (proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/proxy/${proxy._id}`,
    inform: `Proxy(${proxy.url}) is successfully deleted`,
    callback
  })
};

export const resetProxy = (proxy, platform, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy/${proxy._id}`,
    data: { action: 'reset', platform },
    inform: `Proxy(${proxy.url}) is successfully reset`,
    callback
  })
};

export const deleteBulkProxies = (proxyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { proxyIds },
    inform: `${proxyIds.length} proxies are successfully deleted`,
    callback
  })
};
