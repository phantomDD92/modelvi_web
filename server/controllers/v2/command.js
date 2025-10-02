const { Platform } = require("../../config/const");
const AccountModel = require("../../models/account");
const LogModel = require("../../models/log");
const ScheduleModel = require("../../models/schedule");
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

const executeFixMedia = async () => {
  const accounts = await AccountModel.find({}, "platform alias params.contents").limit(2);
  for (var account of accounts) {
    const contents = account.params.contents || [];
    const newContents = contents.filter(content => content.media && content.media.length > 0 && content.media[0].name);
    console.log(`### [${account.platform}] ${account.alias} ::: ${contents.length} => ${newContents.length}`);
  }
  return `All schedules are updated`;
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
      case "fix_media":
        message = await executeFixMedia();
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