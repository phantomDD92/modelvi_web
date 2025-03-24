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

export const refreshToken = (callback) => async (dispatch) => {
  await ApiRequest.patchAction(dispatch, {
    path: `/v2/auth`,
    action: ACTIONS.LOAD_PROFILE,
    callback,
  })
};