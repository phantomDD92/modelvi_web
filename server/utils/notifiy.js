const axios = require('axios');
const moment = require('moment');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const sendMessage = (who, what, message) => {
  if (process.env.DISCORD_AGENCIES_WEBHOOK) {
    axios.post(process.env.DISCORD_AGENCIES_WEBHOOK, {
      username: `${who}`,
      content: `[ ${moment().format("YYYY-MM-DD HH:mm:ss")} ]\n**${message}**\n${what}`
    })
      .then(() => { })
      .catch(() => { })
  }
}

const sendContactMail = async (from, subject, content) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE == "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  let mailOptions = {
    from: from,
    to: process.env.EMAIL_USER,
    subject: subject,
    html: content
  };
  await transporter.sendMail(mailOptions);
}

const sendMail = async (to, subject, content) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE == "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: content
  };
  await transporter.sendMail(mailOptions);
}

const sendDebugMessage = (who, what, message) => {
  if (process.env.DISCORD_WEBHOOK_DEBUG) {
    axios.post(process.env.DISCORD_WEBHOOK_DEBUG, {
      username: `${who}`,
      content: `[ ${moment().format("YYYY-MM-DD HH:mm:ss")} ]\n**${what}**\n${message}`
    })
      .then(() => { })
      .catch(() => { })
  }
}

const sendPaymentMessage = (agency, subject, message) => {
  if (process.env.DISCORD_WEBHOOK_PAYMENT) {
    axios.post(process.env.DISCORD_WEBHOOK_PAYMENT, {
      username: `${agency?.name}`,
      content: `[ ${moment().format("YYYY-MM-DD HH:mm:ss")} ]\n**${subject}**\n${message}`
    })
      .then(() => { })
      .catch(() => { })
  }
}


const sendExpenseMessage = (agency, account, message) => {
  if (process.env.DISCORD_WEBHOOK_PAYMENT) {
    axios.post(process.env.DISCORD_WEBHOOK_PAYMENT, {
      username: `${agency?.name}`,
      content: `[ ${moment().format("YYYY-MM-DD HH:mm:ss")} ]\n**Expense for ${account.platform} - ${account.alias}**\n${message}`
    })
      .then(() => { })
      .catch(() => { })
  }
}

const NotifyUtils = {
  sendContactMail,
  sendMail,
  sendMessage,
  sendDebugMessage,  // send debug information
  sendPaymentMessage,
  sendExpenseMessage,
}

module.exports = NotifyUtils;