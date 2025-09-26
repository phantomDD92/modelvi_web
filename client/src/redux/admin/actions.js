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

export const loadProxiesNewForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/proxy_new`,
    action: ACTIONS.LOAD_PROXIES_NEW,
    callback
  })
};

export const clearProxiesNewForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy_new`,
    inform: `all proxies are successfully deleted.`,
    callback
  })
};

export const changeProxyStatusNewForAdmin = (proxy, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/proxy_new/${proxy._id}`,
    data: { action: "status", status },
    inform: `Proxy(${proxy.url}) is successfully ${status ? "enabled" : "disabled"}`,
    callback
  })
};

export const appendProxiesNewForAdmin = (proxies, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/proxy_new`,
    data: { proxies },
    info: `${proxies.length} proxies are successfully appended`,
    callback
  })
};

export const deleteProxyNewForAdmin = (proxy, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/proxy_new/${proxy._id}`,
    info: `proxy(${proxy.url}) is successfully removed`,
    callback
  })
};

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

export const getChatTeamForAdmin = (team, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/chat/${team._id}`,
    action: ACTIONS.GET_CHAT_TEAM,
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

export const loadModelListForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/model_list`,
    action: ACTIONS.LOAD_MODEL_LIST,
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
    path: `/v2/admin/account/${platform}`,
    params: { agency, search },
    action: ACTIONS.LOAD_ACCOUNTS,
    callback
  });
};

export const updateAccountsStatusForAdmin = (platform, accountIds, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/account/${platform}`,
    data: { action: "status", accountIds, status },
    inform: `${accountIds.length} accounts are successfully ${status ? "enabled" : "disabled"}`,
    callback
  });
};

export const deleteAccountsForAdmin = (platform, accountIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/account/${platform}`,
    data: { accountIds },
    inform: `${accountIds.length} accounts are successfully deleted`,
    callback
  });
};

export const updateAccountStatusForAdmin = (account, status, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/account/${account.platform}/${account._id}`,
    data: { action: "status", status },
    inform: `Account (${account.alias}) is successfully ${status ? "enabled" : "disabled"}`,
    callback,
  });
};

export const createAccountForAdmin = (platform, params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/account/${platform}`,
    data: params,
    inform: `Account (${params.alias}) is successfully created`,
    callback
  });
};

export const changeAccountForAdmin = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/account/${platform}/${account._id}`,
    data: { action: "change", ...params },
    inform: `Account (${account.alias}) is successfully changed`,
    callback
  });
};

export const updateAccountSettingsForAdmin = (platform, account, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/account/${platform}/${account._id}`,
    data: { action: "setting", ...params },
    inform: `Account (${account.alias})'s setting is successfully changed`,
    callback
  })
}

export const deleteAccountForAdmin = (platform, account, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/account/${platform}/${account._id}`,
    inform: `Account (${account.alias}) is successfully deleted`,
    callback
  })
};

export const loadAccountHistoryForAdmin = (platform, accountId, { failedOnly, page, pageSize }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/history/${platform}/${accountId}`,
    params: { failedOnly, page, pageSize },
    action: ACTIONS.LOAD_ACCOUNT_HISTORY,
    callback
  })
}

export const clearAccountHistoryForAdmin = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/history/${platform}/${accountId}`,
    inform: "successfully clear history",
    callback
  })
}

export const clearAccountErrorForAdmin = (platform, accountId, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/history/${platform}/${accountId}`,
    inform: "successfully clear error",
    callback
  })
}

export const loadPaymentsForAdmin = ({ page, status, agency }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/payment`,
    params: { page, status, agency },
    action: ACTIONS.LOAD_PAYMENTS,
    callback
  })
}

export const loadTransactionsForAdmin = ({ page, type, agency }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/transaction`,
    params: { page, type, agency },
    action: ACTIONS.LOAD_TRANSACTIONS,
    callback
  })
}

export const getSchedulePostsForAdmin = ({ agency, model, page }, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/v2/admin/schedule`,
    params: { agency, model, page },
    action: ACTIONS.LOAD_SCHEDULE_CONTENTS,
    callback
  })

export const appendSchedulePostForAdmin = (params, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/schedule`,
    data: params,
    inform: `Scheduled post is successfully appended`,
    callback
  });
};

export const updateSchedulePostForAdmin = (post, params, callback) => async (dispatch) => {
  await ApiRequest.putAction(dispatch, {
    path: `/v2/admin/schedule/${post._id}`,
    data: { action: "change", ...params },
    inform: `Scheduled post is successfully changed`,
    callback
  });
};

export const deleteSchedulePostForAdmin = (post, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/schedule/${post._id}`,
    inform: `Scheduled post is successfully deleted`,
    callback
  })
};

export const getScheduleResultsForAdmin = ({ agency, model, status, platform, page, pageSize }, callback) => (dispatch) =>
  ApiRequest.getAction(dispatch, {
    path: `/v2/admin/schedule_result`,
    params: { agency, model, status, platform, page, pageSize },
    action: ACTIONS.LOAD_SCHEDULE_RESULTS,
    callback
  })

export const fixScheduleResults = (callback) => (dispatch) =>
  ApiRequest.putAction(dispatch, {
    path: `/v2/admin/schedule_result`,
    inform: `Scheduled posts are successfully fixed`,
    callback
  })

export const resetScheduleResultForAdmin = (result, scheduledAt, callback) => (dispatch) =>
  ApiRequest.putAction(dispatch, {
    path: `/v2/admin/schedule_result/${result._id}`,
    data: { action: "reset", scheduledAt },
    inform: `Scheduled post is successfully reset`,
    callback
  })

export const deleteScheduleResultForAdmin = (result, callback) => (dispatch) =>
  ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/schedule_result/${result._id}`,
    inform: `Scheduled post is successfully deleted`,
    callback
  })

export const getStatisticsForAdmin = (callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: "/v2/admin/stats",
    action: ACTIONS.GET_STATISTICS,
    callback
  })
};

export const loadLikeBots = (platform, { search, page, pageSize }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/like/${platform}`,
    params: { search, page, pageSize },
    action: ACTIONS.LOAD_LIKE_BOTS,
    callback
  })
};

export const createLikeBot = (platform, users, callback) => (dispatch) =>
  ApiRequest.postAction(dispatch, {
    path: `/v2/admin/like/${platform}`,
    data: { users },
    inform: `Like bots are successfully appended`,
    callback
  })

export const updateLikeBotSettings = (platform, params, callback) => (dispatch) =>
  ApiRequest.putAction(dispatch, {
    path: `/v2/admin/like/${platform}`,
    data: { action: "settings", ...params },
    inform: `Like bot settings are successfully updated`,
    callback
  })

export const deleteLikeBot = (bot, callback) => (dispatch) =>
  ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/like/${bot.platform}/${bot._id}`,
    inform: `Like bot is successfully deleted`,
    callback
  })

export const deleteLikeBots = (platform, botIds, callback) => (dispatch) =>
  ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/like/${platform}`,
    data: { botIds },
    inform: `${botIds.length} like bots are successfully deleted`,
    callback
  })

export const changeLikeBotStatus = (bot, status, callback) => (dispatch) =>
  ApiRequest.putAction(dispatch, {
    path: `/v2/admin/like/${bot.platform}/${bot._id}`,
    data: { action: "status", status },
    inform: `Like bot is successfully ${status ? "started" : "stopped"}`,
    callback
  })

export const changeLikeBotsStatus = (platform, botIds, status, callback) => (dispatch) =>
  ApiRequest.putAction(dispatch, {
    path: `/v2/admin/like/${platform}`,
    data: { action: "status", status, botIds },
    inform: `${botIds.length} like bots are successfully ${status ? "started" : "stopped"}`,
    callback
  })
export const loadLikeComments = ({ search }, callback) => async (dispatch) => {
  await ApiRequest.getAction(dispatch, {
    path: `/v2/admin/like/comment`,
    params: { search },
    action: ACTIONS.LOAD_LIKE_COMMENTS,
    callback
  })
};

export const appendLikeComments = (comments, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/like/comment`,
    data: { comments },
    inform: `${comments.length} comments are successfully appended`,
    callback
  })
};

export const deleteLikeComments = (commentIds, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/like/comment`,
    data: { commentIds },
    inform: `${commentIds.length} comments are successfully deleted`,
    callback
  })
};

export const deleteLikeComment = (comment, callback) => async (dispatch) => {
  await ApiRequest.deleteAction(dispatch, {
    path: `/v2/admin/like/comment/${comment._id}`,
    inform: `comment is successfully deleted`,
    callback
  })
};

export const executeCommandForAdmin = (command, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/command`,
    data: { command },
    inform: `Command is successfully executed`,
    callback
  })
};

export const loadAgencyCommentsForAdmin = (agencyId, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/agency/${agencyId}`,
    data: { action: "comments" },
    action: ACTIONS.LOAD_AGENCY_COMMENTS,
    callback
  })
};

export const loadAgencyBlockUsersForAdmin = (agencyId, callback) => async (dispatch) => {
  await ApiRequest.postAction(dispatch, {
    path: `/v2/admin/agency/${agencyId}`,
    data: { action: "users" },
    action: ACTIONS.LOAD_AGENCY_BLOCK_USERS,
    callback
  })
};
