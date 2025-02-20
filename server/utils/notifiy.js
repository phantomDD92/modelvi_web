const axios = require('axios');
const moment = require('moment');
const dotenv = require("dotenv");
dotenv.config();

const sendMessage = async (who, what, message) => {
  if (process.env.DISCORD_AGENCIES_WEBHOOK) {
    axios.post(process.env.DISCORD_AGENCIES_WEBHOOK, {
      username: `${who}`,
      content: `[ ${moment().format("YYYY-MM-DD HH:mm:ss")} ]\n**${message}**\n${what}`
    })
      .then(() => { })
      .catch(() => { })
  }
}

const NotifyUtils = {
  sendMessage,
}

module.exports = NotifyUtils;