import { Platform } from "./const";

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
    default:
      break;
  }
  return "Unknown";
}