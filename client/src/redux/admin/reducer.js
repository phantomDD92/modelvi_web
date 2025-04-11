import ACTIONS from "./types";

const initialState = {
  affiliateAgencies: [],
  affiliateStatsByAgency: [],
  affiliateStatsByTime: [],
  transactionStatsByAgency: [],
  transactionStatsByTime: [],
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
    default:
      return state;
  }
};

export default adminReducer;
