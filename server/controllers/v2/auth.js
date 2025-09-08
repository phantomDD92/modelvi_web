const bcryptjs = require('bcryptjs')
// const { authenticator } = require('otplib');
const jwt = require('jsonwebtoken');

const ManagerModel = require("../../models/manager");
const { sendError, sendResult, ApiError } = require("../../utils/resp");
const ProxyService2 = require('../../services/v2/proxy');
const ModelService2 = require('../../services/v2/model');
const AccountService2 = require('../../services/v2/account');
const { generateReferralCode, getClientIp } = require('../../utils/helper');
const AffiliateService2 = require('../../services/v2/affiliate');
const AgencyService2 = require('../../services/v2/agency');
const TransactionService2 = require('../../services/v2/transaction');
const { sendMail } = require('../../utils/notifiy');
const { getVerifyEmailTemplate } = require('../../utils/helper');
const NotifyUtils = require('../../utils/notifiy');

const handleRegisterAgency = async (req, res) => {
  try {
    const { name, email, telegram, password, referralCode } = req.body;
    // first check if duplicated one already exists
    let dupAgency = await ManagerModel.findOne({ email }, 'name email version')
    if (!dupAgency) {
      dupAgency = await ManagerModel.findOne({ name }, 'name email version')
    }
    if (dupAgency && dupAgency.version > 1) {
      throw new ApiError(`Agency with ${name}, ${email} already exists`);
    }
    if (dupAgency) { // update agency
      await ManagerModel.findByIdAndUpdate(dupAgency._id, {
        $set: {
          name, email, telegram, password: bcryptjs.hashSync(password, 12), version: 2, verified: false,
        }
      });
    } else {
      let referrer;
      if (referralCode) {
        referrer = await AgencyService2.findAgencyByReferralCode(referralCode);
      }
      // create new agency
      await ManagerModel.create({
        name, email, telegram, password: bcryptjs.hashSync(password, 12), version: 2, verified: false, referrer
      })
      if (referralCode) {
        const ipAddress = getClientIp(req);
        const agency = await AgencyService2.findAgencyByReferralCode(referralCode)
        const affiliate = await AffiliateService2.findOrCreateAffiliate(agency._id, referralCode, ipAddress);
        await AffiliateService2.setAffiliateCompleted(affiliate._id);
      }
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleLoginAgency = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agency = await ManagerModel.findOne({ email }, "password status role name verified");
    if (!agency)
      throw new ApiError(`Agency(${email}) is not registerd`);
    if (!agency.status)
      throw new ApiError(`Agency(${email}) is disabled`);
    // if (!agency.verified) {
    //   const verifyToken = jwt.sign({ id: agency._id }, process.env.SECRET_KEY || "SECRET_KEY_MODELVI", { expiresIn: "600s" });
    //   const emailContent = getVerifyEmailTemplate(`/verify?token=${verifyToken}`)
    //   await sendMail(email, 'ModelVI Email Verification', emailContent);
    //   sendResult(res, { needVerify: true });
    //   return
    // }
    const passwordCompare = await bcryptjs.compare(password, agency.password);
    if (!passwordCompare)
      throw new ApiError("Password is incorrect");
    const token = jwt.sign({ id: agency._id, role: agency.role, name: agency.name }, process.env.SECRET_KEY || "SECRET_KEY_MODELVI", { expiresIn: "1d" });
    const profile = await ManagerModel.findById(agency._id, "name email telegram role balance status vip verified");
    const profileJson = profile.toJSON();
    const proxyCount = await ProxyService2.getAgencyProxyCount(agency._id);
    const modelCount = await ModelService2.getAgencyModelCount(agency._id);
    const accounts = await AccountService2.findAgencyAccounts(agency._id);
    let monthlyFee = 0;
    for (account of accounts) {
      monthlyFee += (account.fee || 50);
    }
    sendResult(res, { token, profile: { ...profileJson, proxyCount, modelCount, accountCount: accounts.length, monthlyFee } });
  } catch (error) {
    sendError(res, error)
  }
}

const handleGetProfile = async (req, res) => {
  try {
    const proxyCount = await ProxyService2.getAgencyProxyCount(req.manager._id);
    const modelCount = await ModelService2.getAgencyModelCount(req.manager._id);
    const accounts = await AccountService2.findAgencyAccounts(req.manager._id);
    let monthlyFee = 0;
    for (account of accounts) {
      monthlyFee += (account.fee || 50);
    }
    sendResult(res, { profile: { ...req.manager, proxyCount, modelCount, accountCount: accounts.length, monthlyFee } })
  } catch (error) {
    sendError(res, error);
  }
}

const handleChangePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const agency = await AgencyService2.findAgencyById(req.manager._id);
    if (!agency)
      throw new ApiError(`Agency does not exist.`)
    const passwordCompare = await bcryptjs.compare(password, agency.password);
    if (!passwordCompare)
      throw new ApiError("Old password is incorrect");
    await AgencyService2.changePassword(agency._id, bcryptjs.hashSync(newPassword, 12));
    sendResult(res);
  } catch (error) {
    console.error(error)
    sendError(res, error);
  }
}


const handleGetAffiliate = async (req, res) => {
  try {
    // first get referral code
    let referralCode = req.manager.referralCode;
    if (!referralCode) {
      referralCode = generateReferralCode(12);
      await AgencyService2.setReferralCode(req.manager._id, referralCode);
    }
    // get clicks, attempted registrations, finalized registrations statistics
    referrals = await AffiliateService2.getAgencyTotalAffiliateStats(req.manager._id);
    referralStats = await AffiliateService2.getAgencyMonthlyAffiliateStats(req.manager._id, new Date().getFullYear());
    // get affiliate sales statistics
    const referees = await AgencyService2.findReferees(req.manager._id)
    const refereeIds = referees.map(referee => referee._id);
    const earnings = await TransactionService2.getTotalEarningsByReferees(refereeIds);
    const earningStats = await TransactionService2.getMonthlyEarningsByReferees(refereeIds, new Date().getFullYear());
    sendResult(res, { referralCode, referrals: referrals[0], referralStats, earnings: earnings[0], earningStats })
  } catch (error) {
    sendError(res, error);
  }
}

const handleCreateAffiliateClick = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const ipAddress = getClientIp(req);
    if (referralCode) {
      const agency = await AgencyService2.findAgencyByReferralCode(referralCode);
      if (agency) {
        await AffiliateService2.findOrCreateAffiliate(agency._id, referralCode, ipAddress)
      }
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleUpdateAffiliateRegistration = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const ipAddress = getClientIp(req);
    if (referralCode) {
      const agency = await AgencyService2.findAgencyByReferralCode(referralCode);
      if (agency) {
        const affiliate = await AffiliateService2.findOrCreateAffiliate(agency._id, referralCode, ipAddress);
        await AffiliateService2.setAffiliateAttempted(affiliate._id)
      }
    }
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const handleVerifyAgency = async (req, res) => {
  try {
    const { token } = req.query;
    const { id } = jwt.verify(token, process.env.SECRET_KEY || "SECRET_KEY_MODELVI");

    await ManagerModel.findByIdAndUpdate(id, {
      $set: {
        verified: true,
      }
    });
    sendResult(res, { success: true });
  } catch (error) {
    sendResult(res, { success: false });
    // sendError(res, error)
  }
}


const handleSendContact = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message || !subject)
      throw new ApiError("All fields are required");
    const htmlContent = message.split("\n").map(p => `<p>${p.replace(/\n/g, '')}</p>`).join('') + `<br><p>From <b>${name}</b></p>`;
    await NotifyUtils.sendContactMail(email, subject, htmlContent)
    sendResult(res);
  } catch (error) {
    sendError(res, error)
  }
}

const AuthCtrl2 = {
  handleRegisterAgency,
  handleLoginAgency,
  handleGetProfile,
  handleGetAffiliate,
  handleCreateAffiliateClick,
  handleUpdateAffiliateRegistration,
  handleVerifyAgency,
  handleSendContact,
  handleChangePassword,
};

module.exports = AuthCtrl2