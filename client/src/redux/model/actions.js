import ACTIONS from "./types";
import ApiRequest from "@/utils/api";

export const loadModels = ({ page, pageSize }) => async (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/actor`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_MODELS,
  })

export const loadAllModels = () => async (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/all`,
    action: ACTIONS.LOAD_ALL_MODELS,
  })


export const createModel = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: "/actor",
    data: params,
    inform: "successfully create model",
    callback
  })
};

export const deleteModel = (model, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/actor`,
    data: { id: model._id },
    inform: "successfully delete model",
    callback
  })
};

export const updateModel = (model, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor`,
    data: { id: model._id, ...params },
    inform: "successfully update model",
    callback
  })
};


export const setModelStatus = (model, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor/${model._id}`,
    data: { status },
    inform: "successfully set model status",
    callback
  })
};

export const loadDiscords = ({ page, pageSize }) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/discord`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_DISCORDS,
  });
};

export const createDiscord = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/discord`,
    data: params,
    inform: "successfully create discord url",
    callback
  })
};

export const updateDiscord = (discord, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/discord/${discord._id}`,
    data: params,
    inform: "successfully update discord url",
    callback
  })
};

export const deleteDiscord = (discord, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/discord`,
    data: { id: discord._id },
    inform: "successfully delete discord url",
    callback
  })
};

export const appendModel = (discord, model, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/discord/${discord._id}`,
    data: { model },
    inform: "successfully append model",
    callback
  })
};

export const removeModel = (discord, model, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/discord/${discord._id}`,
    data: { model },
    inform: "successfully remove model",
    callback
  })
};

export const loadAccounts = (platform, { page, pageSize }) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/account/${platform}`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_ACCOUNTS,
  });
};

export const setAccountStatus = (account, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${account.platform}`,
    data: { id: account._id, status },
    inform: "account status is successfully changed",
    callback,
  });
};

export const createAccount = (platform, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/account/${platform}`,
    data: params,
    inform: "account status is successfully changed",
    callback
  });
};

export const updateAccount = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/account/${platform}/${account._id}`,
    data: params,
    inform: "account is successfully updated",
    callback
  });
};

export const updateAccountParams = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/account/${platform}/${account._id}`,
    data: params,
    inform: "successfully update account params.",
    callback
  })
}

export const deleteAccount = (platform, account, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/account/${platform}/${account._id}`,
    inform: "account is successfully deleted",
    callback
  })
};

export const getModelContent = (model) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/actor/${model}`,
    action: ACTIONS.GET_MODEL_CONTENT,
  })

export const appendModelContent = (model, params, callback) => async (dispatch) => {
  const formData = new FormData()
  formData.append('title', params.title)
  formData.append('folder', params.folder)
  formData.append('tags', params.tags)
  formData.append('image', params.images[0].originFileObj);
  await ApiRequest.postAction(dispatch, {
    path: `/actor/${model}`,
    data: formData,
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: "successfully append content",
    callback
  });
};


export const deleteModelContent = (model, content, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/actor/${model}`,
    data: { content: content._id },
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: "successfully delete content.",
    callback
  })
};

export const clearModelContents = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/actor/${model}`,
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: "successfully clear contents.",
    callback
  })
};

export const syncModelContents = (model, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/content/${model}`,
    action: ACTIONS.GET_MODEL_CONTENT,
    inform: "successfully sync contents.",
    callback
  })
};

export const loadAccountHistory = (platform, accountId, { page, pageSize }) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/history/${platform}/${accountId}`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_ACCOUNT_HISTORY,
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

export const startAllAccount = (platform, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/all/${platform}`,
    inform: "successfully starts all bots",
    callback
  })
}

export const stopAllAccount = (platform, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/all/${platform}`,
    inform: "successfully stop all bots",
    callback
  })
}

export const loadSchedules = ({platform, actor, page, pageSize}, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/schedule`,
    params: {platform, actor, page, pageSize},
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
    params,
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
