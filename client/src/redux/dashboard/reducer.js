import ACTIONS from "./types";

const initialState = {
  auth: {},
  token: localStorage.getItem("token"),
  stats: {
    discordCount: 0,
    proxyCount: 0,
    proxyExpiredCount: 0,
    f2fCount: 0,
    fncCount: 0,
    fanCount: 0,
    f2fDisabledCount: 0,
    fncDisabledCount: 0,
    fanDisabledCount: 0,
    f2fRunningCount: 0,
    fncRunningCount: 0,
    fanRunningCount: 0,
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
  comments: [],
  commentsValid: false,
  users: [],
  usersValid: false,
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
      };
    case ACTIONS.LOGIN_MANAGER:
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        auth: action.payload.auth,
      }
    case ACTIONS.LOGOUT_MANAGER:
      localStorage.setItem("token", undefined)
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
        commentsValid: true,
      }
    case ACTIONS.UPDATE_COMMENTS:
      return {
        ...state,
        commentsValid: false,
      }
    case ACTIONS.LOAD_USERS:
      return {
        ...state,
        users: action.payload.users,
        usersValid: true,
      }
    case ACTIONS.UPDATE_USERS:
      return {
        ...state,
        usersValid: false,
      }
    default:
      return state;
  }
};

export default dashboardReducer;
