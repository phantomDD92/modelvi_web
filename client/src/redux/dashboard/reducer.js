import ACTIONS from "./types";

const initialState = {
  auth: {},
  token: localStorage.getItem("token"),
  stats: {
    discordCount: 0,
    proxyCount: 0,
    proxyExpiredCount: 0,
    f2fCount: 0,
    f2fDisabledCount: 0,
    f2fRunningCount: 0,
    fncCount: 0,
    fncDisabledCount: 0,
    fncRunningCount: 0,
    fanCount: 0,
    fanDisabledCount: 0,
    fanRunningCount: 0,
    fanvueCount: 0,
    fanvueDisabledCount: 0,
    fanvueRunningCount: 0,
    knkyCount: 0,
    knkyDisabledCount: 0,
    knkyRunningCount: 0,
    maloumCount: 0,
    maloumDisabledCount: 0,
    maloumRunningCount: 0,
    actorCount: 0,
    actorUpdatedCount: 0,
  },
  disabledAccounts: [],
  setting: {
    headless: false,
    viewWidth: 0,
    viewHeight: 0,
    captchaKey: ''
  },
  managers: [],
  modelStats: [],
  accountStats: [],
  comments: [],
  users: [],
  agencyUsers: [],
  agencyComments: [],
}

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_STATS:
      return {
        ...state,
        stats: action.payload.stats,
        disabledAccounts: action.payload.disabledAccounts || []
      };
    case ACTIONS.LOAD_SETTING:
    case ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        setting: action.payload,
      };
    case ACTIONS.LOAD_MANAGERS:
      return {
        ...state,
        managers: action.payload.managers,
        modelStats: action.payload.modelStats,
        accountStats: action.payload.accountStats,
      };
    case ACTIONS.LOGIN_MANAGER:
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        auth: action.payload.auth,
      }
    case ACTIONS.LOGOUT_MANAGER:
      localStorage.clear("token")
      return {
        ...state,
        token: undefined,
        auth: {},
      }
    case ACTIONS.RELOAD_MANAGER:
      return {
        ...state,
        auth: action.payload.auth,
      }
    case ACTIONS.LOAD_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments,
      }
    case ACTIONS.UPDATE_COMMENTS:
      return {
        ...state,
      }
    case ACTIONS.LOAD_USERS:
      return {
        ...state,
        users: action.payload.users,
      }
    case ACTIONS.UPDATE_USERS:
      return {
        ...state,
      }
    case ACTIONS.LOAD_AGENCY_USERS:
      return {
        ...state,
        agencyUsers: action.payload.users,
      }
    case ACTIONS.LOAD_AGENCY_COMMENTS:
      return {
        ...state,
        agencyComments: action.payload.comments,
      }
    default:
      return state;
  }
};

export default dashboardReducer;
