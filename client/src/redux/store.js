import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import v2Reducer from "./v2/reducer";
import adminReducer from "./admin/reducer";

const initialState = {};

const reducers = combineReducers({
  v2: v2Reducer,
  admin: adminReducer,
});

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunk)
);

export default store;
