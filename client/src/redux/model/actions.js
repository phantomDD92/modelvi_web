import ACTIONS from "./types";
import ApiRequest from "@/utils/api";

export const loadModels = (callback) => async (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/actor`,
    action: ACTIONS.LOAD_MODELS,
    callback
  })


export const createModel = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: "/actor",
    data: params,
    inform: `Model (${params.name}) is successfully created`,
    callback
  })
};

export const deleteModel = (model, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/actor/${model._id}`,
    inform: `Model (${model.name}) is successfully deleted`,
    callback
  })
};

export const deleteBulkModels = (modelIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/actor`,
    data: { modelIds },
    inform: `${modelIds.length} models are successfully deleted`,
    callback
  })
};

export const syncBulkModels = (modelIds, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor`,
    data: { action: "sync", modelIds },
    inform: `${modelIds.length} models are successfully synchronized`,
    callback
  })
};

export const syncModel = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor/${model._id}`,
    data: { action: "sync" },
    inform: `Model (${model.name}) is successfully synchronized`,
    callback
  })
};

export const changeModel = (model, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor/${model._id}`,
    data: { action: "change", ...params },
    inform: `Model (${model.name}) is successfully changed`,
    callback
  })
};

export const updateModelProfile = (actor, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor/${actor._id}`,
    data: { action: "profile", ...params },
    inform: `Model (${actor.name})'s profile is successfully updated`,
    callback
  })
};

export const changeModelOwner = (actor, agency, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor/${actor._id}`,
    data: { action: "agency", agency },
    inform: `Model (${actor.name})'s agency is successfully changed`,
    callback
  })
};


const waitForTimeout = (secs) => new Promise(resolve => setTimeout(() => resolve(), secs * 1000));

export const loadAccounts = (platform, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/account/${platform}`,
    action: ACTIONS.LOAD_ACCOUNTS,
    callback
  });
};

export const updateBulkAccountsStatus = (platform, accountIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${platform}`,
    data: { action: "status", accountIds, status },
    inform: `${accountIds.length} accounts are successfully ${status ? "enabled" : "disabled"}`,
    callback
  });
};

export const deleteBulkAccounts = (platform, accountIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/account/${platform}`,
    data: { accountIds },
    inform: `${accountIds.length} accounts are successfully deleted`,
    callback
  });
};

export const updateAccountStatus = (account, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${account.platform}/${account._id}`,
    data: { action: "status", status },
    inform: `Account (${account.alias}) is successfully ${status ? "enabled" : "disabled"}`,
    callback,
  });
};

export const createAccount = (platform, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/account/${platform}`,
    data: params,
    inform: `Account (${params.alias}) is successfully created`,
    callback
  });
};

export const changeAccount = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${platform}/${account._id}`,
    data: { action: "change", ...params },
    inform: `Account (${account.alias}) is successfully changed`,
    callback
  });
};

export const updateAccountSettings = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${platform}/${account._id}`,
    data: { action: "setting", ...params },
    inform: `Account (${account.alias})'s setting is successfully changed`,
    callback
  })
}

export const deleteAccount = (platform, account, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/account/${platform}/${account._id}`,
    inform: `Account (${account.alias}) is successfully deleted`,
    callback
  })
};

export const getModelContent = (actorId, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/content/${actorId}`,
    action: ACTIONS.GET_MODEL_CONTENT,
    callback
  })

export const appendModelContent = (model, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/content/${model._id}`,
    data: params,
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: `Model (${model.name})'s content is successfully appended`,
    callback
  });
};

export const clearModelContents = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/content/${model._id}`,
    data: { action: "clear" },
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: `Model (${model.name})'s contents are successfully cleared`,
    callback
  })
};

export const deleteModelBulkContents = (model, contentIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/content/${model._id}`,
    data: { contentIds },
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: `Model (${model.name})'s ${contentIds.length} contents are successfully deleted`,
    callback
  })
};

export const updateModelBulkContentsPlatform = (model, contentIds, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/content/${model._id}`,
    data: { action: "platform", contentIds, ...params },
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: `Model (${model.name})'s ${contentIds.length} contents' platforms are successfully changed`,
    callback
  });
};

export const updateModelContent = (model, content, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/content/${model._id}/${content._id}`,
    data: { action: "change", ...params },
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: `Model (${model.name})'s content is successfully changed`,
    callback
  });
};

export const deleteModelContent = (model, content, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/content/${model._id}/${content._id}`,
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: `Model (${model.name})'s content is successfully deleted`,
    callback
  })
};

export const loadAccountHistory = (platform, accountId, { page, pageSize }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/history/${platform}/${accountId}`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_ACCOUNT_HISTORY,
    callback
  })
}

export const clearAccountHistory = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/history/${platform}/${accountId}`,
    inform: "successfully clear history",
    callback
  })
}

export const clearAccountError = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/history/${platform}/${accountId}`,
    inform: "successfully clear error",
    callback
  })
}

export const changeAllStatus = (platform, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${platform}`,
    data: { action: "all", status },
    inform: `All accounts are successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
}

export const loadSchedules = ({ platform, actor, page, pageSize }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/schedule`,
    params: { platform, actor, page, pageSize },
    action: ACTIONS.LOAD_SCHEDULES,
    callback
  })
}

export const createSchedule = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/schedule`,
    data: params,
    inform: "successfully create schedule",
    callback
  });
}

export const changeSchedule = (schedule, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/schedule/${schedule._id}`,
    data: params,
    inform: "successfully change schedule",
    callback
  })
}

export const deleteSchedule = (schedule, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/schedule/${schedule._id}`,
    inform: "successfully delete schedule",
    callback
  })
}
