import ACTIONS from "./types";

const initialState = {
  proxies: [],
  proxiesCount: 0,
}

const proxyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_PROXIES:
      return {
        ...state,
        proxies: action.payload.proxies,
        proxiesCount: action.payload.proxiesCount
      };
    default:
      return state;
  }
};

export default proxyReducer;
