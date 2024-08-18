import { combineReducers, createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import authReducer from "./reducers/authReducer";
import modalReducer from "./reducers/modalReducer";
import dashboardReducer from "./dashboard/reducer";
import proxyReducer from "./proxy/reducer";
import modelReducer from "./model/reducer";

const initialState = {};

const reducers = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  home: dashboardReducer,
  proxy: proxyReducer,
  model: modelReducer
});

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunk)
);

export default store;
