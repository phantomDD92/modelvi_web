const { PricePlanMode } = require("../../config/const");
const AccountService2 = require("../../services/v2/account");
const AgencyService2 = require("../../services/v2/agency");
const { getPricePlan, getModelPricePlan, getModelFee } = require("../../utils/helper");

const calculateAgencyFee = async (agency) => {
    const pricePlanMode = agency.pricePlanMode || PricePlanMode.PER_MODEL;
    let fee = 0;
    if (pricePlanMode == PricePlanMode.PER_ACCOUNT) {
        console.log(`##### [PER_ACCOUNT] ${agency.name}`);
        const accounts = await AccountService2.getAgencyPayableAccounts(agency._id);
        for (var account of accounts) {
            const accountFee = getPricePlan(agency, account.platform, account.revenue);
            console.log(`[${account.platform}] ${account.alias} : ${account.revenue} => ${accountFee}`);
            fee += accountFee
        }
    } else {
        console.log(`##### [PER_MODEL] ${agency.name}`);
        const models = await AccountService2.getAgencyPayableModels(agency._id);
        for (var model of models) {
            const modelFee = getModelFee(agency, model.revenue, model.accounts);
            console.log(`[${model.model} (${(model.accounts || []).length} accounts)]: ${model.revenue} => ${modelFee}`);
            fee += modelFee
        }
    }
    return fee;
}

const handleCheckBalance = async () => {
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

const TaskCtrl2 = {
    handleCheckBalance
};

module.exports = TaskCtrl2;