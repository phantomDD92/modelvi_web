import ApiRequest from "@/utils/api";

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
    data: params,
  })
  callback && callback(payload);
};

export const refreshToken = (callback) => async (dispatch) => {
  const payload = await ApiRequest.patchAction(dispatch, {
    path: `/v2/auth`,
  })
  callback && callback(payload);
};