import { AdminRole } from "@/utils/const";
import { LuArchive, LuArrowLeftToLine, LuArrowRightFromLine, LuHome, LuMessageCircle, LuMessageSquareDashed, LuMessagesSquare, LuNetwork, LuSatellite, LuThumbsUp, LuTrophy, LuUser, LuUsers, LuUserSquare, LuWallet } from "react-icons/lu";
import { Link } from "react-router-dom";

// export const agencyMenus = [
//   { key: "dashboard", icon: <LuHome />, label: "Dashboard", path: "/" },
//   { key: "model", icon: <LuUser />, label: "Model", path: "/model" },
//   { key: "account", icon: <LuUserSquare />, label: "Account", path: "/account/F2F" },
//   { key: "schedule", icon: <LuSatellite />, label: "Schedule", path: "/schedule" },
//   { key: "chat", icon: <LuMessagesSquare />, label: "Chat Team", path: "/chat" },
//   { key: "comment", icon: <LuMessageCircle />, label: "Comment", path: "/comment" },
//   { key: "billing", icon: <LuWallet />, label: "Billing", path: "/billing/payments" },
//   { key: "affiliate", icon: <LuTrophy />, label: "Affiliate", path: "/affiliate" },
//   { key: "to_admin", icon: <LuArrowRightFromLine />, label: "To Admin", path: "/admin/dashboard", visible: role => role == AdminRole.MANAGER },
// ]


// export const adminMenus = [
//   { key: "admin_dashboard", icon: <LuHome />, label: "Dashboard", path: "/admin" },
//   { key: "admin_agency", icon: <LuUsers />, label: "Agency", path: "/admin/agency" },
//   { key: "admin_model", icon: <LuUser />, label: "Model", path: "/admin/model" },
//   { key: "admin_account", icon: <LuUserSquare />, label: "Account", path: "/admin/account/F2F" },
//   { key: "admin_proxy", icon: <LuNetwork />, label: "Proxy", path: "/admin/proxy" },
//   { key: "admin_proxy_new", icon: <LuNetwork />, label: "Proxy(LikeBot)", path: "/admin/proxy_new" },
//   { key: "admin_schedule", icon: <LuSatellite />, label: "Schedule", path: "/admin/schedule" },
//   { key: "admin_chat", icon: <LuMessagesSquare />, label: "Chat Team", path: "/admin/chat" },
//   { key: "admin_comment", icon: <LuMessageCircle />, label: "Comment", path: "/admin/comment" },
//   // {key: "admin_like", icon: "LuThumbsUp", label: "Like Bot, "}
//   { key: "admin_like", icon: <LuThumbsUp />, label: "Like Bot", path: "/admin/like/FANLIKE" },
//   { key: "admin_like_comment", icon: <LuMessageSquareDashed />, label: "Comment(Like Bot)", path: "/admin/like_comment" },
//   { key: "admin_finance", icon: <LuWallet />, label: "Finance", path: "/admin/finance/payments" },
//   { key: "admin_affiliate", icon: <LuTrophy />, label: "Affiliate", path: "/admin/affiliate" },
//   { key: "to_agency", icon: <LuArrowLeftToLine />, label: "To Agency", path: "/dashboard" },
// ]

export const agencyMenus = [
  { key: "dashboard", icon: <LuHome />, label: <Link to="/">Dashboard</Link> },
  { key: "model", icon: <LuUser />, label: <Link to="/model">Model</Link> },
  { key: "account", icon: <LuUserSquare />, label: <Link to="/account/F2F">Account</Link> },
  { key: "schedule", icon: <LuSatellite />, label: <Link to="/schedule">Schedule</Link> },
  { key: "chat", icon: <LuMessagesSquare />, label: <Link to="/chat">Chat Team</Link> },
  { key: "comment", icon: <LuMessageCircle />, label: <Link to="/comment">Comment</Link> },
  { key: "billing", icon: <LuWallet />, label: <Link to="/billing/payments">Billing</Link> },
  { key: "affiliate", icon: <LuTrophy />, label: <Link to="/affiliate">Affiliate</Link> },
  { key: "to_admin", icon: <LuArrowRightFromLine />, label: <Link to="/admin/dashboard">To Admin</Link>, visible: role => role == AdminRole.MANAGER },
]

export const adminMenus = [
  { key: "admin_dashboard", icon: <LuHome />, label: <Link to="/admin">Dashboard</Link> },
  {
    key: "admin_post", icon: <LuArchive />, label: "Post Bot", children: [
      { key: "admin_model", icon: <LuUser />, label: <Link to="/admin/model">Model</Link> },
      { key: "admin_account", icon: <LuUserSquare />, label: <Link to="/admin/account/F2F">Account</Link> },
      { key: "admin_schedule", icon: <LuSatellite />, label: <Link to="/admin/schedule">Schedule</Link> },
      // { key: "admin_proxy", icon: <LuNetwork />, label: <Link to="/admin/proxy">Proxy</Link> },
      { key: "admin_chat", icon: <LuMessagesSquare />, label: <Link to="/admin/chat">Chat Team</Link> },
    ]
  },
  {
    key: "admin_like", icon: <LuThumbsUp />, label: "Like Bot", children: [
      { key: "admin_like_account", icon: <LuUserSquare />, label: <Link to="/admin/like/FANLIKE" >Account</Link> },
      { key: "admin_like_comment", icon: <LuMessageSquareDashed />, label: <Link to="/admin/like_comment" >Comment</Link> },
    ]
  },
  { key: "admin_agency", icon: <LuUsers />, label: <Link to="/admin/agency">Agency</Link> },
  { key: "admin_proxy", icon: <LuNetwork />, label: <Link to="/admin/proxy">Proxy</Link> },
  { key: "admin_finance", icon: <LuWallet />, label: <Link to="/admin/finance/payments">Finance</Link> },
  { key: "admin_affiliate", icon: <LuTrophy />, label: <Link to="/admin/affiliate">Affiliate</Link> },
  { key: "to_agency", icon: <LuArrowLeftToLine />, label: <Link to="/dashboard">To Agency</Link> },
]