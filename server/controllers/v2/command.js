const fs = require('fs');
const moment = require('moment')
const AccountModel = require("../../models/account");
const ActorModel = require("../../models/actor");
const ScheduleResultModel = require("../../models/scheduleResult");
const LogService2 = require("../../services/v2/log");
const ProxyNewService2 = require("../../services/v2/proxyNew");
const { PricePlanMode } = require("../../config/const");
const AccountService2 = require("../../services/v2/account");
const AgencyService2 = require("../../services/v2/agency");
const { getPricePlan, getModelFee, getDueDate, getWarningEmailTemplate, getErrorEmailTemplate, getFiatAmount, getAccountFee } = require("../../utils/helper");
const { sendError, ApiError, sendResult } = require("../../utils/resp");
const { DEFAULT_PROXY_FEE } = require('../../utils/const');
const TransactionService2 = require('../../services/v2/transaction');
const NotifyUtils = require('../../utils/notifiy');

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
  console.log("$$$ FIX MEDIA");
  const models = await ActorModel.find({}, "number name contents").limit(10);
  console.log(`$$$ FIND ${models.length} models`);
  for (var model of models) {
    const contents = model.contents || [];
    if (contents.length == 0)
      continue;
    console.log(`### ${model.number}. ${model.name} => ${contents.length} contents`)
    const newContents = contents.map(content => {
      const newMedia = content.media.map(media => {
        const stats = fs.statSync(`uploads/${media.name}`);
        return ({ ...media, size: stats.size });
      });
      return ({ ...content, media: newMedia });
    });
    console.log(newContents);
    break;
  }
}

const executeCalculateFee = async () => {
  try {
    let bulkOperations = [];
    const agencies = await AgencyService2.loadAgencies();
    for (var agency of agencies) {
      const fee = await calculateAgencyFee(agency);
      bulkOperations.push({
        updateOne: {
          filter: { _id: agency._id },
          update: { $set: { fee } }
        }
      });
    }
    await AgencyService2.bulkWrite(bulkOperations);
  } catch (error) {
    console.error(error);
  }
};


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
      case "check_fee":
        message = "check fee";
        await executeCalculateFee();
        break;
      default:
        throw new ApiError("unknown command");
    }
    sendResult(res, { message });
  } catch (error) {
    sendError(res, error)
  }
}


const calculateAgencyFee = async (agency) => {
  const pricePlanMode = agency.pricePlanMode || PricePlanMode.PER_MODEL;
  let fee = 0;
  if (pricePlanMode == PricePlanMode.PER_ACCOUNT) {
    const accounts = await AccountService2.getAgencyPayableAccounts(agency._id);
    for (var account of accounts) {
      const accountFee = getAccountFee(agency, account.platform, account.revenue);
      // console.log(`[${account.platform}] ${account.alias} : ${account.revenue} => ${accountFee}`);
      fee += accountFee
    }
    // console.log(`##### [PER_ACCOUNT] ${agency.name} => ${fee}`);
  } else {
    const models = await AccountService2.getAgencyPayableModels(agency._id);
    for (var model of models) {
      const modelFee = getModelFee(agency, model.revenue, model.accounts);
      // console.log(`[${model.model} (${(model.accounts || []).length} accounts)]: ${model.revenue} => ${modelFee}`);
      fee += modelFee
    }
    // console.log(`##### [PER_MODEL] ${agency.name} => ${fee}`);
  }
  return fee;
}

const handleCalculateFee = async () => {
  try {
    const agencies = await AgencyService2.loadAgencies();
    for (var agency of agencies) {
      const serviceFee = await calculateAgencyFee(agency);
      await AgencyService2.updateFee(agency._id, serviceFee);
      if (serviceFee == 0)
        continue;
      const proxyCount = await AccountService2.getAgencyProxyCount(agency._id);
      const proxyFee = proxyCount * DEFAULT_PROXY_FEE;
      const fee = serviceFee + proxyFee;
      const dueDate = getDueDate(agency);
      const delta = moment(dueDate).diff(moment().startOf("day"), "day");
      const balance = agency.balance || 0
      // console.log(`[${agency.name}]\nService Fee : ${serviceFee}\nProxy Fee : ${proxyFee}\nDue Date : ${dueDate.format("YYYY-MM-DD")}\nRemaining Date : ${delta}\nBalance : ${balance}\n`)
      if (delta == 7) {
        if (balance < fee) {
          await NotifyUtils.sendMail(agency.email, `🚫 Insufficient Funds For Automatic Renewal`, getWarningEmailTemplate(agency, "Insufficient Funds For Automatic Renewal", dueDate, serviceFee, proxyFee));
        }
      } else if (delta == 3) {
        if (balance < fee) {
          await NotifyUtils.sendMail(agency.email, `🚫 Insufficient Funds For Automatic Renewal`, getWarningEmailTemplate(agency, "Insufficient Funds For Automatic Renewal", dueDate, serviceFee, proxyFee));
        }
      } else if (delta == 1) {
        if (balance < fee) {
          await NotifyUtils.sendMail(agency.email, `🚫 Modelvi Service Will Be Paused Soon`, getWarningEmailTemplate(agency, "Modelvi Service Will Be Paused Soon", dueDate, serviceFee, proxyFee));
        }
      } else if (delta == 0) {
        if (balance < fee) {
          await NotifyUtils.sendMail(agency.email, `🚫 Modelvi Service Paused`, getErrorEmailTemplate(agency, dueDate, fee));
          await AccountService2.disableAgencyAccounts(agency._id, "no balance");
        }
        await AgencyService2.updateBalance(agency._id, -1 * fee);
        await TransactionService2.createExpenseTransaction(
          agency._id,
          fee,
          balance,
          balance - fee,
          `payout for Modelvi service`,
          0
        );
        NotifyUtils.sendExpenseMessage(agency, `Service Fee: ${getFiatAmount(serviceFee)}\nProxy Fee: ${getFiatAmount(proxyFee)}\nBalance: ${getFiatAmount(balance)} => ${getFiatAmount(balance - fee)}\n`)
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const CommandCtrl2 = {
  handleExecuteCommand,
  handleCalculateFee
};

module.exports = CommandCtrl2