import { toast } from "react-hot-toast";
import ACTIONS from "./types";
import ApiRequest from "@/utils/api";

export const getStats = () => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: "/stats",
    action: ACTIONS.LOAD_STATS,
  })
};

export const loadSetting = () => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: "/setting",
    action: ACTIONS.LOAD_SETTING,
  })
};


export const updateSetting = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/setting`,
    inform: `successfully update setting.`,
    data: params,
    callback
  });
};


export const loadAgencies = () => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/manager`,
    action: ACTIONS.LOAD_MANAGERS,
  })
};

export const createAgency = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/manager`,
    data: params,
    inform: `agency(${params.name}) is successfully created.`,
    callback
  })
};

export const deleteAgency = (agency, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/manager`,
    data: { name: agency.name },
    inform: `agency(${agency.name}) is successfully deleted.`,
    callback
  })
};

export const changeAgencyStatus = (agency, status, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/manager/${agency._id}`,
    data: {status},
    inform: `Agency(${agency.name}) is ${status ? 'enabled': 'disabled'}`,
    callback
  })
};

export const updateAgency = (agency, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/manager/${agency._id}`,
    data: params,
    inform: `Agency(${agency.name}) info is changed.`,
    callback
  })
};

export const changePassword = (name, password, newPassword, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/manager`,
    inform: `manager(${name})'s password is successfully changed.`,
    data: { name, password, newPassword },
    callback
  })
};

export const loginManager = (name, password, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/auth`,
    data: { name, password },
    action: ACTIONS.LOGIN_MANAGER,
    inform: `manager(${name}) is successfully logged in.`,
    callback
  })
};

export const logoutManager = () => async (dispatch) => {
  dispatch({ type: ACTIONS.LOGOUT_MANAGER });
  toast.success(`manager(${username}) is successfully logged out`)
};

export const reloadManager = (token) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: '/auth',
    action: ACTIONS.RELOAD_MANAGER,
  })
};

export const loadComments = () => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: '/comment',
    action: ACTIONS.LOAD_COMMENTS,
  })
};

export const createComment = (text, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: '/comment',
    data: { text },
    inform: 'comment is successfully created.',
    callback
  })
};

export const deleteComment = (comment, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/comment/${comment._id}`,
    inform: 'comment is successfully deleted.',
    callback
  })
};

export const clearComments = (callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/comment`,
    inform: 'comments is all cleared.',
    callback
  })
};

