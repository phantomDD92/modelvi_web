import ApiRequest from "@/utils/api";

export const registerAgency = (params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/auth`,
    data: params,
    inform: `${modelIds.length} models are successfully synchronized`,
    callback
  })
};