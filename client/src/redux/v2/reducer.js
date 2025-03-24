import ACTIONS from "./types";

const initialState = {
  profile: {},
}

const v2Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_PROFILE:
      return {
        ...state,
        profile: action.payload.profile,
      };
    default:
      return state;
  }
};

export default v2Reducer;
