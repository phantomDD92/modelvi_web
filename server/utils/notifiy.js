const axios = require('axios');
const moment = require('moment');
const nodemailer = require('nodemailer');
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

const sendContactMail = async (from, subject, content) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE,
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
    secure: process.env.MAILER_SECURE,
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

const NotifyUtils = {
  sendMessage,
  sendContactMail,
  sendMail,
}

module.exports = NotifyUtils;