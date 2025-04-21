import React from "react"
import {
  AccountListPage,
  AdminAgencyListPage,
  AdminChatTeamPage,
  AdminDashboardPage,
  CommentListPage,
  ModelContentPage,
} from "@/pages"
import AccountHistoryPage from "@/pages/agency/AccountHistoryPage"
import AdminAffiliatePage from "@/pages/admin/AdminAffiliatePage"
import AdminProxyStatPage from "@/pages/admin/AdminProxyStatPage"
import AdminProxyAgencyPage from "@/pages/admin/AdminProxyAgencyPage"
import AdminModelPage from "@/pages/admin/AdminModelPage"

const adminRoutes = [
  { key: "admin_dashboard", path: "/admin", component: <AdminDashboardPage />, },
  { key: "admin_agency", path: "/admin/agency", component: <AdminAgencyListPage />, },
  { key: "admin_model", path: "/admin/model", component: <AdminModelPage />, },
  { key: "admin_content", path: "/admin/model/:modelId", component: <ModelContentPage />, },
  { key: "admin_account", path: "/admin/account/:platform", component: <AccountListPage />, },
  { key: "admin_history", path: "/admin/account/:platform/:accountId", component: <AccountHistoryPage /> },
  { key: "admin_comment", path: "/admin/comment", component: <CommentListPage />, },
  { key: "admin_proxy", path: "/admin/proxy", component: <AdminProxyStatPage />, },
  { key: "admin_agency_proxy", path: "/admin/proxy/:agencyId", component: <AdminProxyAgencyPage />, },
  { key: "admin_chat", path: "/admin/chat", component: <AdminChatTeamPage />, },
  { key: "admin_finance", path: "/admin/finance", component: <div>Admin Finance Page</div>, },
  { key: "admin_affiliate", path: "/admin/affiliate", component: <AdminAffiliatePage />, },
]


export default adminRoutes