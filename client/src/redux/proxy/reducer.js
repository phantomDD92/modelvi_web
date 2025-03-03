import ACTIONS from "./types";

const initialState = {
  proxies: [],
}

const proxyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_PROXIES:
      return {
        ...state,
        proxies: action.payload.proxies,
      };
    default:
      return state;
  }
};

export default proxyReducer;
