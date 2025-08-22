import ApiRequest from "@/utils/api";
import ACTIONS from "./types";

export const registerAgency = (params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/auth`,
    data: params,
    inform: `Agency(${params.name}) is successfully registerd.`,
    callback
  })
};

export const loginAgency = (params, callback) => async (dispatch) => {
  const payload = await ApiRequest.postAction(dispatch, {
    path: `/v2/auth`,
    action: ACTIONS.LOAD_PROFILE,
    data: params,
  })
  callback && callback(payload);
};

export const getProfile = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/profile`,
    action: ACTIONS.LOAD_PROFILE,
    callback,
  })
};


export const createPayment = (currency, callback) => async (dispatch) => {
  try {
    const payload = await ApiRequest.postAction(dispatch, {
      path: `/v2/agency/payment`,
      data: { currency },
      action: ACTIONS.GET_PAYMENT,
    })
    callback && callback(payload.payment?._id);
  } catch (error) {
    callback && callback();
  }

}

export const loadPayments = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/payment`,
    action: ACTIONS.LOAD_PAYMENTS,
    callback,
  })
}

export const cancelPayment = (paymentID, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/payment/${paymentID}`,
    inform: `Payment is canceled`,
    callback,
  })
}

export const getPayment = (paymentID, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/payment/${paymentID}`,
    action: ACTIONS.GET_PAYMENT,
    callback,
  })
}

export const loadTransactions = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/transaction`,
    action: ACTIONS.LOAD_TRANSACTIONS,
    callback,
  })
}

export const getAffiliate = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/affiliate`,
    action: ACTIONS.GET_AFFILIATE,
    callback,
  })
}

export const setAffiliateClick = (referralCode) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/affiliate`,
    data: { referralCode }
  })
}

export const setAffiliateRegistration = (referralCode) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/affiliate`,
    data: { referralCode }
  })
}

export const clearProxies = (callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { action: "clear" },
    inform: "All proxies are successfully cleared",
    callback
  })
};

export const appendProxies = (proxies, deadline, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { proxies, deadline },
    inform: `${proxies.length} proxies are successfully appended`,
    callback
  })
};

export const loadProxies = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/proxy`,
    action: ACTIONS.LOAD_PROXIES,
    callback
  })
};

export const changeProxyStatus = (proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy/${proxy._id}`,
    data: { action: "status", status },
    inform: `Proxy(${proxy.url}) is successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const changeBulkProxiesStatus = (proxyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { action: "status", status, proxyIds },
    inform: `${proxyIds.length} proxies are successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const deleteProxy = (proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/proxy/${proxy._id}`,
    inform: `Proxy(${proxy.url}) is successfully deleted`,
    callback
  })
};

export const resetProxy = (proxy, platform, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/proxy/${proxy._id}`,
    data: { action: 'reset', platform },
    inform: `Proxy(${proxy.url}) is successfully reset`,
    callback
  })
};

export const deleteBulkProxies = (proxyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/proxy`,
    data: { proxyIds },
    inform: `${proxyIds.length} proxies are successfully deleted`,
    callback
  })
};
export const verifyAgency = (params, callback) => async (dispatch) => {
  try {
    const payload = await ApiRequest.postAction(dispatch, {
      path: `/v2/verify?token=${params.token}`,
    })
    callback && callback(payload.success);
  } catch (error) {
    callback && callback(false);
  }
};

export const loadModelList = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/model_list`,
    action: ACTIONS.LOAD_MODEL_LIST,
    callback
  });
};

export const loadModels = (search, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/model`,
    params: { search },
    action: ACTIONS.LOAD_MODELS,
    callback
  });
};

export const createModel = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: "/v2/agency/model",
    data: { ...params },
    inform: `Model (${params.name}) is successfully created`,
    callback
  })
};

export const deleteModel = (model, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/model/${model._id}`,
    inform: `Model (${model.name}) is successfully deleted`,
    callback
  })
};

export const deleteModels = (modelIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/model`,
    data: { modelIds },
    inform: `${modelIds.length} models are successfully deleted`,
    callback
  })
};

export const syncModels = (modelIds, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/model`,
    data: { action: "sync", modelIds },
    inform: `${modelIds.length} models are successfully synchronized`,
    callback
  })
};

export const syncModel = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/model/${model._id}`,
    data: { action: "sync" },
    inform: `Model (${model.name}) is successfully synchronized`,
    callback
  })
};

export const changeModel = (model, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/model/${model._id}`,
    data: { action: "change", ...params },
    inform: `Model (${model.name}) is successfully changed`,
    callback
  })
};

export const getModelContents = (modelId, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/v2/agency/content/${modelId}`,
    action: ACTIONS.GET_MODEL_CONTENTS,
    callback
  })

export const appendModelContent = (model, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/content/${model._id}`,
    data: params,
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s content is successfully appended`,
    callback
  });
};

export const clearModelContents = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/content/${model._id}`,
    data: { action: "clear" },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s contents are successfully cleared`,
    callback
  })
};

export const importModelContents = (model, contents, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/content/${model._id}`,
    data: { action: "import", contents },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s contents are successfully imported`,
    callback
  })
};

export const deleteModelContents = (model, contentIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/content/${model._id}`,
    data: { contentIds },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s ${contentIds.length} contents are successfully deleted`,
    callback
  })
};

export const updateModelContentsPlatform = (model, contentIds, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/content/${model._id}`,
    data: { action: "platform", contentIds, ...params },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s ${contentIds.length} contents' platforms are successfully changed`,
    callback
  });
};

export const updateModelContent = (model, content, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/content/${model._id}/${content._id}`,
    data: { action: "change", ...params },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s content is successfully changed`,
    callback
  });
};

export const deleteModelContent = (model, content, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/content/${model._id}/${content._id}`,
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s content is successfully deleted`,
    callback
  })
};

export const loadAccountList = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/account_list`,
    action: ACTIONS.LOAD_ACCOUNT_LIST,
    callback
  });
};


export const loadAccounts = (platform, search, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/account/${platform}`,
    params: { search },
    action: ACTIONS.LOAD_ACCOUNTS,
    callback
  });
};

export const updateAccountsStatus = (platform, accountIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/account/${platform}`,
    data: { action: "status", accountIds, status },
    inform: `${accountIds.length} accounts are successfully ${status ? "enabled" : "disabled"}`,
    callback
  });
};

export const deleteAccounts = (platform, accountIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/account/${platform}`,
    data: { accountIds },
    inform: `${accountIds.length} accounts are successfully deleted`,
    callback
  });
};

export const updateAccountStatus = (account, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/account/${account.platform}/${account._id}`,
    data: { action: "status", status },
    inform: `Account (${account.alias}) is successfully ${status ? "enabled" : "disabled"}`,
    callback,
  });
};

export const createAccount = (platform, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/account/${platform}`,
    data: params,
    inform: `Account (${params.alias}) is successfully created`,
    callback
  });
};

export const changeAccount = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/account/${platform}/${account._id}`,
    data: { action: "change", ...params },
    inform: `Account (${account.alias}) is successfully changed`,
    callback
  });
};

export const updateAccountSettings = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/account/${platform}/${account._id}`,
    data: { action: "setting", ...params },
    inform: `Account (${account.alias})'s setting is successfully changed`,
    callback
  })
}

export const deleteAccount = (platform, account, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/account/${platform}/${account._id}`,
    inform: `Account (${account.alias}) is successfully deleted`,
    callback
  })
};

export const loadAccountHistory = (platform, accountId, { page, pageSize }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/history/${platform}/${accountId}`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_ACCOUNT_HISTORY,
    callback
  })
}

export const clearAccountHistory = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/history/${platform}/${accountId}`,
    inform: "successfully clear history",
    callback
  })
}

export const clearAccountError = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/history/${platform}/${accountId}`,
    inform: "successfully clear error",
    callback
  })
}


export const getSchedulePosts = ({ model, page }, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/v2/agency/schedule`,
    params: { model, page },
    action: ACTIONS.LOAD_SCHEDULE_CONTENTS,
    callback
  })

export const appendSchedulePost = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/schedule`,
    data: params,
    inform: `Scheduled post is successfully appended`,
    callback
  });
};

export const clearSchedulePosts = (callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/schedule`,
    data: { action: "clear" },
    inform: `Scheduled posts are successfully cleared`,
    callback
  })
};

export const deleteSchedulePosts = (model, postIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/schedule`,
    data: { postIds },
    inform: `${postIds.length} scheduled posts are successfully deleted`,
    callback
  })
};

export const updateSchedulePost = (post, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/schedule/${post._id}`,
    data: { action: "change", ...params },
    inform: `Scheduled post is successfully changed`,
    callback
  });
};

export const deleteSchedulePost = (post, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/schedule/${post._id}`,
    inform: `Scheduled post is successfully deleted`,
    callback
  })
};

export const getScheduleResults = ({ model, status, platform, page, pageSize }, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/v2/agency/schedule_result`,
    params: { model, status, platform, page, pageSize },
    action: ACTIONS.LOAD_SCHEDULE_RESULTS,
    callback
  })

export const resetScheduleResult = (result, callback) => (dispatch) =>
  ApiRequest.putAction(dispatch, {
    path: `/v2/agency/schedule_result/${result._id}`,
    data: { action: "reset" },
    inform: `Scheduled post is successfully reset`,
    callback
  })

export const deleteScheduleResult = (result, callback) => (dispatch) =>
  ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/schedule_result/${result._id}`,
    inform: `Scheduled post is successfully deleted`,
    callback
  })

export const loadChatTeams = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/agency/chat`,
    action: ACTIONS.LOAD_CHAT_TEAMS,
    callback
  });
};

export const createChatTeam = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/agency/chat`,
    data: params,
    inform: `Chat team (${params.name}) is successfully created`,
    callback
  })
};

export const changeChatTeam = (team, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/agency/chat/${team._id}`,
    data: { ...params, action: "change" },
    inform: `Chat team (${team.name}) is successfully changed`,
    callback
  })
};

export const deleteChatTeam = (team, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/chat/${team._id}`,
    inform: `Chat team (${team.name}) is successfully deleted`,
    callback
  })
};

export const deleteChatTeams = (teamIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/agency/chat`,
    data: { teamIds },
    inform: `${teamIds.length} chat teams are successfully deleted`,
    callback
  })
};


export const getStatistics = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: "/v2/agency/stats",
    action: ACTIONS.GET_STATISTICS,
    callback
  })
};

