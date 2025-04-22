import ApiRequest from "@/utils/api";
import ACTIONS from "./types";

export const loadAffiliatesForAdmin = (time = "day", callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/affiliate`,
    params: { time },
    action: ACTIONS.LOAD_AFFILIATES,
    callback
  })
}

// proxy related actions
export const loadProxiesForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/proxy`,
    action: ACTIONS.LOAD_PROXIES,
    callback
  })
};

export const clearAllProxiesForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy`,
    inform: `all proxies are successfully deleted.`,
    callback
  })
};

export const loadAgencyProxiesForAdmin = (agencyId, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    action: ACTIONS.LOAD_AGENCY_PROXIES,
    callback
  })
};

export const appendAgencyProxiesForAdmin = (agencyId, proxies, deadline, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { proxies, deadline },
    callback
  })
};

export const clearAgencyProxiesForAdmin = (agencyId, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { action: "clear" },
    inform: `agency's proxies are successfully deleted`,
    callback
  })
};

export const changeProxyStatusForAdmin = (agencyId, proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}/${proxy._id}`,
    data: { action: "status", status },
    inform: `Proxy(${proxy.url}) is successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const changeBulkProxiesStatusForAdmin = (agencyId, proxyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { action: "status", status, proxyIds },
    inform: `${proxyIds.length} proxies are successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const deleteProxyForAdmin = (agencyId, proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}/${proxy._id}`,
    inform: `Proxy(${proxy.url}) is successfully deleted`,
    callback
  })
};

export const resetProxyForAdmin = (agencyId, proxy, platform, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}/${proxy._id}`,
    data: { action: 'reset', platform },
    inform: `Proxy(${proxy.url}) is successfully reset`,
    callback
  })
};

export const deleteBulkProxiesForAdmin = (agencyId, proxyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy/${agencyId}`,
    data: { proxyIds },
    inform: `${proxyIds.length} proxies are successfully deleted`,
    callback
  })
};

export const loadAgenciesForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/agency`,
    action: ACTIONS.LOAD_AGENCIES,
    callback,
  })
};

export const deleteAgenciesForAdmin = (agencyIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/agency`,
    data: { agencyIds },
    inform: `${agencyIds.length} agencies are successfully deleted.`,
  })
}

export const loadChatTeamsForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/chat`,
    action: ACTIONS.LOAD_CHAT_TEAMS,
    callback
  });
};

export const createChatTeamForAdmin = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/chat`,
    data: params,
    inform: `Chat team (${params.name}) is successfully created`,
    callback
  })
};

export const changeChatTeamForAdmin = (team, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/chat/${team._id}`,
    data: { ...params, action: "change" },
    inform: `Chat team (${team.name}) is successfully changed`,
    callback
  })
};

export const deleteChatTeamForAdmin = (team, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/chat/${team._id}`,
    inform: `Chat team (${team.name}) is successfully deleted`,
    callback
  })
};

export const changeAgenciesStatusForAdmin = (agencyIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency`,
    data: { action: 'status', agencyIds, status },
    inform: `${agencyIds.length} agencies are successfully ${status ? 'enabled' : 'disabled'}.`,
    callback
  })
};

export const deleteAgencyForAdmin = (agency, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    inform: `Agency(${agency.name}) is successfully deleted.`,
    callback
  })
}

export const deleteChatTeamsForAdmin = (teamIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/chat`,
    data: { teamIds },
    inform: `${teamIds.length} chat teams are successfully deleted`,
    callback
  })
};

export const changeAgencyStatusForAdmin = (agency, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    data: { status, action: 'status' },
    inform: `Agency(${agency.name}) is ${status ? 'enabled' : 'disabled'}`,
    callback
  })
};

export const changeAgencyPricePlansForAdmin = (agency, pricePlans, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    data: { pricePlans, action: 'plan' },
    inform: `Agency(${agency.name})'s price plans is successfully updated`,
    callback
  })
};

export const changeAgencyReferrerForAdmin = (agency, referrer, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    data: { referrer, action: 'referrer' },
    inform: `Agency(${agency.name})'s referrer is successfully changed`,
    callback
  })
};

export const changeAgencyCommissionForAdmin = (agency, commission, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    data: { commission, action: 'commission' },
    inform: `Agency(${agency.name})'s commission rate is successfully changed`,
    callback
  })
};

export const appendAgencyBalanceForAdmin = (agency, balance, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/agency/${agency._id}`,
    data: { action: 'balance', balance },
    inform: `Agency(${agency.name}) balance is successfully updated.`,
    callback
  })
}


export const loadAccountStatsForAdmin = (platform, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/account/${platform}`,
    action: ACTIONS.LOAD_ACCOUNTS,
    callback
  });
};

export const loadAgencyListForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/agency_list`,
    action: ACTIONS.LOAD_AGENCY_LIST,
    callback
  });
};

export const loadModelsForAdmin = (agency, search, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/model`,
    params: { agency, search },
    action: ACTIONS.LOAD_MODELS,
    callback
  });
};

export const createModelForAdmin = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: "/v2/admin/model",
    data: { ...params },
    inform: `Model (${params.name}) is successfully created`,
    callback
  })
};

export const deleteModelForAdmin = (model, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/model/${model._id}`,
    inform: `Model (${model.name}) is successfully deleted`,
    callback
  })
};

export const deleteModelsForAdmin = (modelIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/model`,
    data: { modelIds },
    inform: `${modelIds.length} models are successfully deleted`,
    callback
  })
};

export const syncModelsForAdmin = (modelIds, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/model`,
    data: { action: "sync", modelIds },
    inform: `${modelIds.length} models are successfully synchronized`,
    callback
  })
};

export const syncModelForAdmin = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/model/${model._id}`,
    data: { action: "sync" },
    inform: `Model (${model.name}) is successfully synchronized`,
    callback
  })
};

export const changeModelForAdmin = (model, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/model/${model._id}`,
    data: { action: "change", ...params },
    inform: `Model (${model.name}) is successfully changed`,
    callback
  })
};

export const getModelContentsForAdmin = (modelId, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/v2/admin/content/${modelId}`,
    action: ACTIONS.GET_MODEL_CONTENTS,
    callback
  })

export const appendModelContentForAdmin = (model, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/content/${model._id}`,
    data: params,
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s content is successfully appended`,
    callback
  });
};

export const clearModelContentsForAdmin = (model, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/content/${model._id}`,
    data: { action: "clear" },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s contents are successfully cleared`,
    callback
  })
};

export const deleteModelContentsForAdmin = (model, contentIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/content/${model._id}`,
    data: { contentIds },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s ${contentIds.length} contents are successfully deleted`,
    callback
  })
};

export const updateModelContentsPlatformForAdmin = (model, contentIds, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/content/${model._id}`,
    data: { action: "platform", contentIds, ...params },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s ${contentIds.length} contents' platforms are successfully changed`,
    callback
  });
};

export const updateModelContentForAdmin = (model, content, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/content/${model._id}/${content._id}`,
    data: { action: "change", ...params },
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s content is successfully changed`,
    callback
  });
};

export const deleteModelContentForAdmin = (model, content, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/content/${model._id}/${content._id}`,
    action: ACTIONS.GET_MODEL_CONTENTS,
    inform: `Model (${model.name})'s content is successfully deleted`,
    callback
  })
};

export const loadAccountsForAdmin = (platform, agency, search, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/account/account/${platform}`,
    params: { agency, search },
    action: ACTIONS.LOAD_ACCOUNTS,
    callback
  });
};

export const updateAccountsStatusForAdmin = (platform, accountIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/account/account/${platform}`,
    data: { action: "status", accountIds, status },
    inform: `${accountIds.length} accounts are successfully ${status ? "enabled" : "disabled"}`,
    callback
  });
};

export const deleteAccountsForAdmin = (platform, accountIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/account/account/${platform}`,
    data: { accountIds },
    inform: `${accountIds.length} accounts are successfully deleted`,
    callback
  });
};

export const updateAccountStatusForAdmin = (account, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/account/account/${account.platform}/${account._id}`,
    data: { action: "status", status },
    inform: `Account (${account.alias}) is successfully ${status ? "enabled" : "disabled"}`,
    callback,
  });
};

export const createAccountForAdmin = (platform, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/account/account/${platform}`,
    data: params,
    inform: `Account (${params.alias}) is successfully created`,
    callback
  });
};

export const changeAccountForAdmin = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/account/account/${platform}/${account._id}`,
    data: { action: "change", ...params },
    inform: `Account (${account.alias}) is successfully changed`,
    callback
  });
};

export const updateAccountSettingsForAdmin = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/account/account/${platform}/${account._id}`,
    data: { action: "setting", ...params },
    inform: `Account (${account.alias})'s setting is successfully changed`,
    callback
  })
}

export const deleteAccountForAdmin = (platform, account, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/account/account/${platform}/${account._id}`,
    inform: `Account (${account.alias}) is successfully deleted`,
    callback
  })
};

export const loadAccountHistoryForAdmin = (platform, accountId, { page, pageSize }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/account/history/${platform}/${accountId}`,
    params: { page, pageSize },
    action: ACTIONS.LOAD_ACCOUNT_HISTORY,
    callback
  })
}

export const clearAccountHistoryForAdmin = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/account/history/${platform}/${accountId}`,
    inform: "successfully clear history",
    callback
  })
}

export const clearAccountErrorForAdmin = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/account/history/${platform}/${accountId}`,
    inform: "successfully clear error",
    callback
  })
}
