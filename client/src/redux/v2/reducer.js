import ACTIONS from "./types";

const initialState = {

  theme: localStorage.getItem("theme"),

  stats: {},
  disabledAccounts: [],
  profile: {},

  payments: [],
  transactions: [],
  currentPayment: undefined,
  affiliate: {},
  referralCode: undefined,

  proxies: [],

  models: [],
  modelList: [],

  contentModel: undefined,

  accounts: [],
  accountsCount: 0,
  accountList: [],

  logs: [],
  logsCount: 0,
  logAccount: undefined,

  schedules: [],
  schedulesCount: 0,

  scheduleResults: [],
  scheduleResultsCount: 0,

  chatTeams: [],
  chatTeamStats: [],

  comments: [],
  blockUsers: [],
}

const v2Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_STATISTICS:
      return {
        ...state,
        stats: action.payload.stats,
        disabledAccounts: action.payload.disabledAccounts || []
      };
    case ACTIONS.LOAD_PROFILE:
      return {
        ...state,
        profile: action.payload.profile,
      };
    case ACTIONS.GET_PAYMENT:
      return {
        ...state,
        currentPayment: action.payload.payment,
      };
    case ACTIONS.LOAD_PAYMENTS:
      return {
        ...state,
        payments: action.payload.payments,
      };
    case ACTIONS.LOAD_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload.transactions,
      };
    case ACTIONS.GET_AFFILIATE:
      return {
        ...state,
        referralCode: action.payload.referralCode,
        affiliate: {
          referrals: action.payload.referrals,
          referralStats: action.payload.referralStats,
          earnings: action.payload.earnings,
          earningStats: action.payload.earningStats,
        },

      };
    case ACTIONS.LOAD_PROXIES:
      return {
        ...state,
        proxies: action.payload.proxies,
      };
    case ACTIONS.LOAD_MODEL_LIST:
      return {
        ...state,
        modelList: action.payload.models,
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
    case ACTIONS.LOAD_ACCOUNT_LIST:
      return {
        ...state,
        accountList: action.payload.accounts,
      };
    case ACTIONS.LOAD_ACCOUNT_HISTORY:
      return {
        ...state,
        logs: action.payload.logs,
        logsCount: action.payload.logsCount,
        logAccount: action.payload.account
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
    case ACTIONS.LOAD_CHAT_TEAMS:
      return {
        ...state,
        chatTeams: action.payload.teams,
        chatTeamStats: action.payload.teamsStat,
      };
    case ACTIONS.CHANGE_THEME:
      localStorage.setItem("theme", action.payload.theme)
      return {
        ...state,
        theme: action.payload.theme,
      }
    case ACTIONS.LOAD_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments,
      }
    case ACTIONS.LOAD_BLOCK_USERS:
      return {
        ...state,
        blockUsers: action.payload.users,
      }
    default:
      return state;
  }
};

export default v2Reducer;
