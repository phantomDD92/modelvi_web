import moment from "moment";
import { Platform } from "./const";
import { cryptoCurrencies } from "@/data/crypto";

export const getPlatformName = (platform) => {
  switch (platform) {
    case Platform.F2F:
      return "F2F"
    case Platform.FNC:
      return "Fancentro";
    case Platform.FAN:
    case Platform.FANLIKE:
      return "Fansly";
    case Platform.FANVUE:
      return "Fanvue";
    case Platform.KNKY:
      return "Knky";
    case Platform.MALOUM:
      return "Maloum";
    case Platform.ONLYFANS:
      return "OnlyFans";
    case Platform.MYMFANS:
      return "MymFans";
    case Platform.FOURBASED:
      return "4Based";
    case Platform.DFANXYZ:
      return "DFanXyz";
    case Platform.FETLIFE:
      return "FetLife";
    case Platform.LOYALFANS:
      return "LoyalFans";
    case Platform.MYCLUB:
      return "MyClub";
    case Platform.MANYVIDS:
      return "ManyVids";
    default:
      break;
  }
  return "Unknown";
}

export const getDateTime = (value) => moment(value).format("YYYY-MM-DD hh:mm");
export const getDate = (value) => moment(value).format("YYYY-MM-DD");
export const getCurrencyName = (code) => cryptoCurrencies.find(currency => currency.code == code)?.name || "-";

export const getCurrencyAmount = (value, code, status) => {
  if (status == "cancel" || status == "waiting")
    return "-";
  const currency = cryptoCurrencies.find(currency => currency.code == code)
  if (currency) {
    return getCryptoAmount(value, currency.ticker);
  }
  return value.toFixed(2);
}

export const getFiatAmount = (amount, defValue = "-") => amount >= 0 ? `$${(amount || 0).toFixed(2)}` : defValue;

export const getFullFiatAmount = (amount) => amount >= 0 ? `$${(amount || 0).toFixed(2)}` : `- $${(amount * -1).toFixed(2)}`;

export const getCryptoAmount = (amount, ticker, defValue = "-") =>
  amount > 0
    ? (ticker == "USDT" || ticker == "USDC")
      ? `${(amount || 0).toFixed(2)} ${ticker}`
      : `${(amount || 0).toFixed(5)} ${ticker}`
    : defValue;

export function getAccountName(account, agency) {
  let name = ""
  if (agency?.name)
    name += `${agency.name} - `;
  if (account.actor?.number && account.actor?.name)
    name += `[${account.actor.number}] ${account.actor.name} - `
  name += `[${account.platform}] ${account.alias}`;
  return name;
}
