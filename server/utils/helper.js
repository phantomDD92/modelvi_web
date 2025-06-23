const moment = require("moment");
const crypto = require("crypto");
const { DEFAULT_PRICE_PLANS, REVENUE_THRESHOLDS } = require("./const");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const ModelVI_DOMAIN = process.env.ModelVI_DOMAIN ?? 'https://modelvi.com'

function getPricePlan(agency, platform, revenue) {
  const pricePlans = (agency?.pricePlans && agency.pricePlans[platform]) ? agency.pricePlans[platform] || DEFAULT_PRICE_PLANS : DEFAULT_PRICE_PLANS;
  for (var i = 0; i < pricePlans.length; i++) {
    if (revenue < REVENUE_THRESHOLDS[i])
      return pricePlans[i];
  }
  return pricePlans[pricePlans.length - 1];
}

function getDateDelta(date) {
  return date ? moment(date).diff(moment(), "day") : 0;
}

function hasSufficientBalance(agency, price) {
  return ((agency.balance || 0) >= price)
}

function generateReferralCode(length = 10) {
  // Define the character set to use
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Create a cryptographically strong random values array
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  // Build the string
  randomValues.forEach((value) => {
    result += chars[value % chars.length];
  });

  return result;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;
}

function getAccountName(account, agency) {
  let name = ""
  if (agency?.name)
    name += `${agency.name} - `;
  if (account.actor?.number && account.actor?.name)
    name += `[${account.actor.number}] ${account.actor.name} - `
  name += `[${account.platform}] ${account.alias}`;
  return name;
}

function getVerifyEmailTemplate(verifyLink) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ModelVI Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 5px;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
          }
          a {
            color: #ffffff !important;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for registering with our service! To complete your registration, please verify your email address by clicking the button below:</p>
          <a href="${ModelVI_DOMAIN}${verifyLink}" class="button">Verify Email</a>
          <p>If you did not create an account, you can safely ignore this email.</p>
          <p>Thank you,<br>The ModelVI Team</p>
      </div>
  </body>
  </html>`
}

function isModelOwner(model, agency) {
  const ownerId = model.owner?._id || model.owner;
  return ownerId?.toString() == agency._id?.toString()
}

function generateRandomPassword(length = 12) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?,./-=';
  let password = '';

  // Generate secure random bytes
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    // Map each byte to an index in the charset
    const index = bytes[i] % charset.length;
    password += charset[index];
  }

  return password;
}

async function checkLikeBotEmail(email, password) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE == "true",
    auth: {
      user: email,
      pass: password,
    },
  });
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function generateFourDigitString() {
  const randomNumber = Math.floor(Math.random() * 10000); // 0 - 9999
  const fourDigitString = String(randomNumber).padStart(4, '0');
  return fourDigitString;
}

function generateBotAlias(firstName, lastName) {
  const randomNumber = Math.floor(Math.random() * 10000); // 0 - 9999
  const fourDigitString = String(randomNumber).padStart(4, '0');
  return firstName.toLowerCase() + "_" + lastName.toLowerCase() + "_" + fourDigitString;
}

module.exports = {
  getPricePlan,
  getDateDelta,
  hasSufficientBalance,
  generateReferralCode,
  getClientIp,
  getVerifyEmailTemplate,
  getAccountName,
  isModelOwner,
  generateRandomPassword,
  generateFourDigitString,
  checkLikeBotEmail,
  generateBotAlias
}