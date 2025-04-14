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
  proxyStats: [],
  proxyAgency: undefined,
  agencyProxies: [],
  agencyProxyStats: [],

  // agency related state,
  agencies: [],
}

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_AFFILIATES:
      return {
        ...state,
        affiliateAgencies: action.payload.agencies || [],
        affiliateStatsByAgency: action.payload.statsByAgency || [],
        affiliateStatsByTime: action.payload.statsByTime || [],
        transactionStatsByAgency: action.payload.transactionStatsByAgency || [],
        transactionStatsByTime: action.payload.transactionStatsByTime || [],
      };
    case ACTIONS.LOAD_PROXIES:
      return {
        ...state,
        proxyStats: action.payload.stats || [],
      };
    case ACTIONS.LOAD_AGENCY_PROXIES:
      return {
        ...state,
        proxyAgency: action.payload.agency,
        agencyProxies: action.payload.proxies || [],
        // agencyProxyStats: action.payload.stats || [],
      };
    case ACTIONS.LOAD_AGENCIES:
      return {
        ...state,
        agencies: action.payload.agencies || [],
      };
    default:
      return state;
  }
};

export default adminReducer;
