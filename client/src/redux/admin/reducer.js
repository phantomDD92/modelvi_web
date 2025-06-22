import ACTIONS from "./types";

const initialState = {
  stats: {},
  disabledAccounts: [],

  // affiliate state
  affiliateAgencies: [],
  affiliateStatsByAgency: [],
  affiliateStatsByTime: [],
  transactionStatsByAgency: [],
  transactionStatsByTime: [],

  // proxy related state
  proxies: [],
  // statistics per agency
  proxyStats: [],
  accountStats: [],
  modelStats: [],

  proxyAgency: undefined,
  agencyProxies: [],
  agencyProxyStats: [],

  // agency related state,
  agencies: [],
  agencyList: [],
  // chat team related state
  chatTeams: [],
  chatTeamStats: [],

  chatTeam: undefined,
  chatTeamAccounts: [],
  chatTeamModels: [],

  // model related state
  models: [],
  modelList: [],

  contentModel: undefined,

  accounts: [],
  accountsCount: 0,
  // For Account History Page
  history: [],
  historyCount: 0,
  historyAccount: undefined,

  payments: [],
  paymentsCount: 0,

  transactions: [],
  transactionsCount: 0,

  schedules: [],
  schedulesCount: 0,

  scheduleResults: [],
  scheduleResultsCount: 0,

  likeBots: [],
}

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_STATISTICS:
      return {
        ...state,
        stats: action.payload.stats,
        disabledAccounts: action.payload.disabledAccounts || []
      };
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
        proxyStats: action.payload.proxyStats || [],
        accountStats: action.payload.accountStats || [],
        modelStats: action.payload.modelStats || [],
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
        chatTeamStats: action.payload.teamsStat,
      };
    case ACTIONS.GET_CHAT_TEAM:
      return {
        ...state,
        chatTeam: action.payload.team,
        chatTeamAccounts: action.payload.teamAccounts,
        chatTeamActors: action.payload.teamActors,
      };
    case ACTIONS.LOAD_MODELS:
      return {
        ...state,
        models: action.payload.models,
      };
    case ACTIONS.LOAD_MODEL_LIST:
      return {
        ...state,
        modelList: action.payload.models,
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
    case ACTIONS.LOAD_PAYMENTS:
      return {
        ...state,
        payments: action.payload.payments,
        paymentsCount: action.payload.paymentsCount,
      };
    case ACTIONS.LOAD_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload.transactions,
        transactionsCount: action.payload.transactionsCount,
      };
    case ACTIONS.LOAD_SCHEDULE_CONTENTS:
      return {
        ...state,
        schedules: action.payload.schedules,
        schedulesCount: action.payload.schedulesCount,
      };
    case ACTIONS.LOAD_SCHEDULE_RESULTS:
      return {
        ...state,
        scheduleResults: action.payload.results,
        scheduleResultsCount: action.payload.resultsCount,
      }
    case ACTIONS.LOAD_LIKE_BOTS:
      return {
        ...state,
        likeBots: action.payload.bots,
      }
    default:
      return state;
  }
};

export default adminReducer;
