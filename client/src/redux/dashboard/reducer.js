import ACTIONS from "./types";

const initialState = {
  auth: {},
  token: localStorage.getItem("token"),
  stats: {
    discordCount: 0,
    proxyCount: 0,
    f2fCount: 0,
    actorCount: 0,
  },
  setting: {
    headless: false,
    viewWidth: 0,
    viewHeight: 0,
    captchaKey: ''
  },
  managers: [],
  comments: [],
}

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_STATS:
      return {
        ...state,
        stats: action.payload.stats,
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
      }
    default:
      return state;
  }
};

export default dashboardReducer;
