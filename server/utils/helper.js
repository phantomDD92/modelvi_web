const moment = require("moment");
const crypto = require("crypto");
const { DEFAULT_PRICE_PLANS, REVENUE_THRESHOLDS, MODEL_REVENUE_THRESHOLDS, MODEL_PRICE_PLANS, DEFAULT_DUE_DATE } = require("./const");
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


function getModelPricePlan(agency, revenue) {
  const pricePlans = (agency?.pricePlans && agency.pricePlans["MODEL"]) ? agency.pricePlans["MODEL"] : MODEL_PRICE_PLANS;
  for (var i = 0; i < pricePlans.length; i++) {
    if (revenue < MODEL_REVENUE_THRESHOLDS[i])
      return pricePlans[i];
  }
  return pricePlans[pricePlans.length - 1];
}

function getAccountFee(agency, platform, revenue) {
  const pricePlans = (agency?.pricePlans && agency.pricePlans[platform]) ? agency.pricePlans[platform] || DEFAULT_PRICE_PLANS : DEFAULT_PRICE_PLANS;
  for (var i = 0; i < pricePlans.length; i++) {
    if (revenue < REVENUE_THRESHOLDS[i])
      return pricePlans[i];
  }
  return pricePlans[pricePlans.length - 1];
}

function getModelFee(agency, revenue, accounts) {
  if (!accounts || accounts.length == 0)
    return 0;
  const pricePlans = (agency?.pricePlans && agency.pricePlans["MODEL"]) ? agency.pricePlans["MODEL"] : MODEL_PRICE_PLANS;
  const plusFee = ((agency?.pricePlans) ? (agency.pricePlans["PLUS"] || 10) : 10) * (accounts.length - 1)
  for (var i = 0; i < pricePlans.length; i++) {
    if (revenue < MODEL_REVENUE_THRESHOLDS[i])
      return pricePlans[i] + plusFee;
  }
  return pricePlans[pricePlans.length - 1] + plusFee;
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
  const bytes = crypto.randomBytes(length - 4);

  for (let i = 0; i < length - 4; i++) {
    // Map each byte to an index in the charset
    const index = bytes[i] % charset.length;
    password += charset[index];
  }
  return password + "!Mv2";
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
  const fullAlias = firstName.toLowerCase() + lastName.toLowerCase() + fourDigitString;
  return fullAlias.slice(0, 16);
}


function getWarningEmailTemplate(agency, title, dueDate, serviceFee, proxyFee) {
  return `<!DOCTYPE html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insufficient funds for automatic renewal</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 8px;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
            text-align: center;
        }
        .alert-icon {
            color: #DC2626;
            font-size: 24px;
            margin-right: 10px;
            vertical-align: middle;
        }
    </style>
  </head>
  <body>
    <div class="header">
        <h2>${title}</h2>
    </div>
    
    <div class="content">
        
        <p>Dear ${agency.name},</p>
        <p>We want to inform you that you have insufficient funds for automatic renewal of the Modelvi Service</p>
        <p><strong>Due Date:</strong>&nbsp; ${moment(dueDate).format("YYYY-MM-DD")}</p>
        <p><strong>Estimated Service Fee:</strong>&nbsp; ${getFiatAmount(serviceFee)}</p>
        <p><strong>Estimated Proxy Fee:</strong>&nbsp; ${getFiatAmount(proxyFee)}</p>
        <p><strong>Current Balance:</strong>&nbsp; ${getFiatAmount(agency.balance || 0)}</p>
        <p>To keep your automation running smoothly and avoid service interruption, please top up your funds as soon as possible.</p>
        
        <div>
            <a href="https://modelvi.com/billing/stripe" class="button">👉 Top Up Now</a>
        </div>
        
        <div class="divider"></div>
        
        <p>Thank you for using ModelVI</p>
        <p><strong>ModelVI Team</strong></p>
    </div>
    
    <div class="footer">
        <p>© 2023 ModelVI. All rights reserved.</p>
    </div>
  </body>
  </html>`
}

function getErrorEmailTemplate(agency, dueDate, fee) {
  return `<!DOCTYPE html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modelvi Service Paused</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 8px;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
            text-align: center;
        }
        .alert-icon {
            color: #DC2626;
            font-size: 24px;
            margin-right: 10px;
            vertical-align: middle;
        }
    </style>
  </head>
  <body>
    <div class="header">
        <h2>Modelvi Service Paused</h2>
    </div>
    
    <div class="content">
        
        <p>Dear ${agency.name},</p>
        <p>We want to inform you that your Modelvi service paused because of insufficient funds</p>
        <p><strong>Paused Date:</strong>&nbsp; ${moment(dueDate).format("YYYY-MM-DD")}</p>
        <p><strong>Current Balance:</strong>&nbsp; ${getFiatAmount((agency.balance || 0) - fee)}</p>
        <p>To restart your service, please top up your funds.</p>
        
        <div>
            <a href="https://modelvi.com/billing/stripe" class="button">👉 Top Up Now</a>
        </div>
        
        <div class="divider"></div>
        
        <p>Thank you for using Modelvi</p>
        <p><strong>Modelvi Team</strong></p>
    </div>
    
    <div class="footer">
        <p>© 2023 Modelvi. All rights reserved.</p>
    </div>
  </body>
  </html>`
}

const getFiatAmount = (amount) => `$${(amount || 0).toFixed(2)}`;

const getDueDate = (agency) => {
  let nthDate = moment().date(agency.dueDate || DEFAULT_DUE_DATE);
  if (moment().isAfter(nthDate, "day"))
    nthDate = nthDate.add(1, "month").startOf("day");
  return nthDate
}



module.exports = {
  getPricePlan,
  getModelPricePlan,
  getModelFee,
  getAccountFee,
  getAccountFee,
  getDateDelta,
  hasSufficientBalance,
  generateReferralCode,
  getClientIp,
  getVerifyEmailTemplate,
  getWarningEmailTemplate,
  getErrorEmailTemplate,
  getAccountName,
  getFiatAmount,
  isModelOwner,
  generateRandomPassword,
  generateFourDigitString,
  checkLikeBotEmail,
  generateBotAlias,
  getDueDate
}