const axios = require('axios');
const moment = require('moment');
const dotenv = require("dotenv");
dotenv.config();

const sendMessage = async (who, what, message) => {
  if (process.env.DISCORD_AGENCIES_WEBHOOK) {
    axios.post(process.env.DISCORD_AGENCIES_WEBHOOK, { 
      content: `[ ${moment().format("YYYY-MM-DD HH:mm:ss")} ]\n ### ${who}\n &&& ${what}\n --------- ${message}` 
    }).then(() => { }).catch(() => { })
  }
}

const NotifyUtils = {
  sendMessage,
}

module.exports = NotifyUtils;