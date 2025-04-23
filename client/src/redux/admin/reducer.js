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
  agencyList: [],
  // chat team related state
  chatTeams: [],

  // model related state
  models: [],

  contentModel: undefined,

  accounts: [],
  accountsCount: 0,
  // For Account History Page
  history: [],
  historyCount: 0,
  historyAccount: undefined,
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
    case ACTIONS.LOAD_AGENCY_LIST:
      return {
        ...state,
        agencyList: action.payload.agencyList || [],
      };
    case ACTIONS.LOAD_CHAT_TEAMS:
      return {
        ...state,
        chatTeams: action.payload.teams,
      };
    case ACTIONS.LOAD_MODELS:
      return {
        ...state,
        models: action.payload.models,
      };
    case ACTIONS.GET_MODEL_CONTENTS:
      return {
        ...state,
        contentModel: action.payload.model
      };
    case ACTIONS.LOAD_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload.accounts,
      };
    case ACTIONS.LOAD_ACCOUNT_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        historyCount: action.payload.historyCount,
        historyAccount: action.payload.account
      };
    default:
      return state;
  }
};

export default adminReducer;
