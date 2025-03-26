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
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/payment`,
    data: { currency },
    action: ACTIONS.GET_PAYMENT,
    callback
  })
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
