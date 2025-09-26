const { Platform } = require("../../config/const");
const AccountModel = require("../../models/account");
const LogModel = require("../../models/log");
const ScheduleResultModel = require("../../models/scheduleResult");
const LogService2 = require("../../services/v2/log");
const ProxyNewService2 = require("../../services/v2/proxyNew");
const { sendError, ApiError, sendResult } = require("../../utils/resp");

const executeSetProxy = async () => {
  const accounts = await AccountModel.find({}, "proxy");
  for (var account of accounts) {
    if (!account.proxy || account.proxy == "") {
      const proxy = await ProxyNewService2.pickupProxy();
      if (proxy)
        await AccountModel.findByIdAndUpdate(account._id, { $set: { proxy } });
    }
  }
  return `${accounts.length} accounts' proxies are set.`
}

const executeClearAccount = async () => {
  const accounts = await AccountModel.find({}, "owner").populate("owner", "name");
  let count = 0;
  for (var account of accounts) {
    if (!account.owner) {
      count += 1;
      await AccountModel.findByIdAndRemove(account._id);
    }
  }
  return `${count} accounts are removed`;
}

const executeClearSchedule = async () => {
  const results = await ScheduleResultModel.find({}, "account").populate("account", "alias");
  let count = 0;
  for (var result of results) {
    if (!result.account) {
      count += 1;
      await ScheduleResultModel.findByIdAndRemove(result._id);
    }
  }
  return `${count} schedules are removed`;
}

const executeClearHistories = async () => {
  await LogService2.clearLogs();
  return `Old histories are cleared`;
}

const executeFixF2F = async () => {
  const accounts = await AccountModel.find({ platform: Platform.F2F }, "alias params.postRemains")
  for (var account of accounts) {
    const logs = await LogModel.find({ account: account._id, success: true, action: 3 }, "target");
    const newPostIds = await logs.filter(log => log.target).map(log => log.target)
    
    console.log(`### ${account.alias} : old = ${(account.params?.postRemains || []).length} : new = ${newPostIds.length}`)
    console.log(`--- ${newPostIds}`)
    if (account.alias != "gaby" && newPostIds.length > 0) {
      const mergeIds = [...(account.params?.postRemains || []), ...newPostIds]
      await AccountModel.findByIdAndUpdate(account._id, { $set: { "params.postRemains": mergeIds } })
    }
  }
}

const handleExecuteCommand = async (req, res) => {
  try {
    const { command } = req.body;
    let message;
    switch (command) {
      case "set_proxy":
        message = await executeSetProxy();
        break;
      case "clear_account":
        message = await executeClearAccount();
        break;
      case "clear_schedule":
        message = await executeClearSchedule();
        break;
      case "clear_history":
        message = await executeClearHistories();
        break;
      default:
        throw new ApiError("unknown command");
    }
    sendResult(res, { message });
  } catch (error) {
    sendError(res, error)
  }
}



const CommandCtrl2 = {
  handleExecuteCommand
};

module.exports = CommandCtrl2