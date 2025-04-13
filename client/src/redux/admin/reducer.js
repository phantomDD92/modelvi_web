import ACTIONS from "./types";

const initialState = {
  // affiliate state
  affiliateAgencies: [],
  affiliateStatsByAgency: [],
  affiliateStatsByTime: [],
  transactionStatsByAgency: [],
  transactionStatsByTime: [],
  // proxy related state
  proxies: [],
}

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_AFFILIATES:
      return {
        ...state,
        affiliateAgencies: action.payload.agencies,
        affiliateStatsByAgency: action.payload.statsByAgency,
        affiliateStatsByTime: action.payload.statsByTime,
        transactionStatsByAgency: action.payload.transactionStatsByAgency,
        transactionStatsByTime: action.payload.transactionStatsByTime,
      };
    case ACTIONS.LOAD_PROXIES:
      return {
        ...state,
        proxies: action.payload.proxies,
      };
    default:
      return state;
  }
};

export default adminReducer;
