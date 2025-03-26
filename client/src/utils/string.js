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
      return "Fansly";
    case Platform.FANVUE:
      return "Fanvue";
    case Platform.KNKY:
      return "Knky";
    case Platform.MALOUM:
      return "Maloum";
    default:
      break;
  }
  return "Unknown";
}

export const getDateTime = (value) => moment(value).format("YYYY-MM-DD hh:mm");

export const getCurrencyName = (code) => cryptoCurrencies.find(currency => currency.code == code)?.name || "-";

export const getCurrencyAmount = (value, code, status) => {
  if (status == "cancel" || status == "waiting")
    return "-";
  const currency = cryptoCurrencies.find(currency => currency.code == code)
  if (currency) {
    return `${value.toFixed(2)} ${currency.ticker}`;
  }
  return value.toFixed(2);
}