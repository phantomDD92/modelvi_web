import ACTIONS from "./types";

const initialState = {
  profile: {},

  payments: [],
  transactions: [],
  currentPayment: undefined,
  affiliate: {},
  referralCode: undefined,
}

const adminReducer = (state = initialState, action) => {
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
    default:
      return state;
  }
};

export default adminReducer;
