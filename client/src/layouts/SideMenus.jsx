import { AdminRole } from "@/utils/const";
import { LuArrowBigLeft, LuArrowLeftToLine, LuArrowRightFromLine, LuHome, LuMessageCircle, LuMessageSquare, LuMessagesSquare, LuNetwork, LuSatellite, LuTrophy, LuUser, LuUsers, LuUserSquare, LuWallet } from "react-icons/lu";

export const agencyMenus = [
  { key: "dashboard", icon: <LuHome />, label: "Dashboard", path: "/" },
  { key: "model", icon: <LuUser />, label: "Model", path: "/model" },
  { key: "account", icon: <LuUserSquare />, label: "Account", path: "/account/F2F" },
  { key: "proxy", icon: <LuNetwork />, label: "Proxy", path: "/proxy" },
  { key: "schedule", icon: <LuSatellite />, label: "Schedule", path: "/schedule" },
  { key: "comment", icon: <LuMessageSquare />, label: "Comment", path: "/comment" },
  { key: "billing", icon: <LuWallet />, label: "Billing", path: "/billing/payments" },
  { key: "affiliate", icon: <LuTrophy />, label: "Affiliate", path: "/affiliate" },
  { key: "to_admin", icon: <LuArrowRightFromLine />, label: "To Admin", path: "/admin", visible: role => role == AdminRole.MANAGER },
]

export const adminMenus = [
  { key: "admin_dashboard", icon: <LuHome />, label: "Dashboard", path: "/admin" },
  { key: "admin_agency", icon: <LuUsers />, label: "Agency", path: "/admin/agency" },
  { key: "admin_model", icon: <LuUser />, label: "Model", path: "/admin/model" },
  { key: "admin_account", icon: <LuUserSquare />, label: "Account", path: "/admin/account/F2F" },
  { key: "admin_proxy", icon: <LuNetwork />, label: "Proxy", path: "/admin/proxy" },
  { key: "admin_chat", icon: <LuMessagesSquare />, label: "Chat Team", path: "/admin/chat" },
  { key: "admin_comment", icon: <LuMessageCircle />, label: "Comment", path: "/admin/comment" },
  { key: "admin_finance", icon: <LuWallet />, label: "Finance", path: "/admin/finance" },
  { key: "admin_affiliate", icon: <LuTrophy />, label: "Affiliate", path: "/admin/affiliate" },
  { key: "to_agency", icon: <LuArrowLeftToLine />, label: "To Agency", path: "/" },
]