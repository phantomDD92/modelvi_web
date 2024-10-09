const ActionModel = require("../models/action");

const createAction = (accountId, target, uuid, action) => 
    ActionModel.create({
        account: accountId,
        target,
        uuid,
        action
    });

const findAction = (accountId, uuid, action) => 
    ActionModel.findOne({account: accountId, uuid, action});

const ActionService = {
    createAction,
    findAction,
}

module.exports = ActionService;