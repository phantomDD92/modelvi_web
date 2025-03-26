import ACTIONS from "./types";

const initialState = {
  profile: {},
  payments: [],
  transactions: [],
  currentPayment: undefined,
}

const v2Reducer = (state = initialState, action) => {
  switch (action.type) {
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
        payments: action.payload.payments,
      };
    default:
      return state;
  }
};

export default v2Reducer;
