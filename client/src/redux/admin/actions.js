import ApiRequest from "@/utils/api";
import ACTIONS from "./types";

export const loadAffiliatesForAdmin = (time = "day", callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/affiliate`,
    params: {time},
    action: ACTIONS.LOAD_AFFILIATES,
    callback
  })
}