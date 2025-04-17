import ACTIONS from "./types";

const initialState = {
  allModels: [],
  // For Model List Page
  models: [],
  // For Model Content Page
  contents: [],
  contentsUpdated: false,
  contentModel: undefined,
  // For Account List Page
  accounts: [],
  accountsCount: 0,
  // For Account History Page
  history: [],
  historyCount: 0,
  historyAccount: undefined,
  // For Schedule List Page
  schedules: [],
  schedulesCount: 0,
  chatTeams: [],
}

const modelReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_MODELS:
      return {
        ...state,
        models: action.payload.actors,
      };
    case ACTIONS.LOAD_ALL_MODELS:
      return {
        ...state,
        allModels: action.payload.actors,
      };
    case ACTIONS.LOAD_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload.accounts,
      };
    case ACTIONS.GET_MODEL_CONTENT:
      return {
        ...state,
        contents: action.payload.actor.contents,
        contentsUpdated: action.payload.actor.updated,
        contentModel: action.payload.actor
      };
    case ACTIONS.LOAD_ACCOUNT_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        historyCount: action.payload.historyCount,
        historyAccount: action.payload.account
      };
    case ACTIONS.LOAD_SCHEDULES:
      return {
        ...state,
        schedules: action.payload.schedules,
        schedulesCount: action.payload.schedulesCount,
      };
    default:
      return state;
  }
};

export default modelReducer;
