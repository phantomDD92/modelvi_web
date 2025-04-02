import { toast } from "react-hot-toast";
import ACTIONS from "./types";
import ApiRequest from "@/utils/api";

export const getStats = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: "/stats",
    action: ACTIONS.LOAD_STATS,
    callback
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

export const updateDB = (callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/temp`,
    inform: `Database is successfully updated.`,
    callback
  })
};

export const loadAgencies = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/manager`,
    action: ACTIONS.LOAD_MANAGERS,
    callback,
  })
};

export const createAgency = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/manager`,
    data: params,
    inform: `Agency(${params.name}) is successfully created.`,
    callback
  })
};

export const deleteBulkAgencies = (agencyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/manager`,
    data: { agencyIds },
    inform: `${agencyIds.length} agencies are successfully deleted.`,
    callback
  })
};

export const updateBulkAgenciesStatus = (agencyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/manager`,
    data: { action: 'status', agencyIds, status },
    inform: `${agencyIds.length} agencies are successfully ${status ? 'enabled' : 'disabled'}.`,
    callback
  })
};

export const appendAgencyBalance = (agency, balance, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    data: { action: 'balance', balance },
    inform: `Agency(${agency.name}) balance is successfully updated.`,
    callback
  })
}

export const deleteAgency = (agency, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/manager/${agency._id}`,
    inform: `Agency(${agency.name}) is successfully deleted.`,
    callback
  })
};

export const changeAgencyStatus = (agency, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/manager/${agency._id}`,
    data: { status, action: 'status' },
    inform: `Agency(${agency.name}) is ${status ? 'enabled' : 'disabled'}`,
    callback
  })
};

export const updateAgency = (agency, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/manager/${agency._id}`,
    data: { ...params, action: 'change' },
    inform: `Agency(${agency.name}) information is changed.`,
    callback
  })
};

export const resetAgencyPassword = (agency, password, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/manager/${agency._id}`,
    inform: `Agency(${agency.name})'s password is reset.`,
    data: { password, action: 'password' },
    callback
  })
};


export const changePassword = (name, password, newPassword, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/auth`,
    inform: `${name}'s password is successfully changed`,
    data: { name, password, newPassword },
    callback
  })
};

export const loginManager = (name, password, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/auth`,
    data: { name, password },
    action: ACTIONS.LOGIN_MANAGER,
    inform: `${name} is successfully signed in`,
    callback
  })
};

export const logoutManager = () => async (dispatch) => {
  dispatch({ type: ACTIONS.LOGOUT_MANAGER });
  toast.success(`Agency is successfully signed out`)
};

export const changeTheme = (theme) => async (dispatch) => {
  dispatch({ type: ACTIONS.CHANGE_THEME, payload: { theme } });
};


export const reloadManager = (token) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: '/auth',
    action: ACTIONS.RELOAD_MANAGER,
  })
};

export const loadComments = () => async (dispatch, getState) => {
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
    action: ACTIONS.UPDATE_COMMENTS,
    callback
  })
};

export const deleteComment = (commentId, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/comment/${commentId}`,
    inform: 'comment is successfully deleted.',
    action: ACTIONS.UPDATE_COMMENTS,
    callback
  })
};

export const clearComments = (callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/comment`,
    inform: 'comments is all cleared.',
    callback,
    action: ACTIONS.UPDATE_COMMENTS,
  })
};

export const createUser = (alias, status, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: '/user',
    data: { alias, status },
    inform: 'user alias is successfully appended.',
    callback,
    action: ACTIONS.UPDATE_USERS
  })
};

export const deleteUser = (userId, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/user/${userId}`,
    inform: 'user alias is successfully deleted.',
    callback,
    action: ACTIONS.UPDATE_USERS
  });
};

export const loadUsers = () => async (dispatch, getState) => {
  await ApiRequest.getAction(dispatch, {
    path: '/user',
    action: ACTIONS.LOAD_USERS,
  });
};

export const loadAgencyUsers = (agencyId) => async (dispatch, getState) => {
  await ApiRequest.getAction(dispatch, {
    path: `/agency/user/${agencyId}`,
    action: ACTIONS.LOAD_AGENCY_USERS,
  });
};

export const loadAgencyComments = (agencyId) => async (dispatch, getState) => {
  if (agencyId) {
    await ApiRequest.getAction(dispatch, {
      path: `/agency/comment/${agencyId}`,
      action: ACTIONS.LOAD_AGENCY_COMMENTS,
    });
  }
};

export const sendContact = (data, callback) => async (dispatch, getState) => {
  await ApiRequest.postAction(dispatch, {
    path: '/contact',
    data,
    inform: "Email sent successfully",
    callback
  })
}