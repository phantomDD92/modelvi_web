import React from "react"
import {
  AdminAgencyListPage,
  AdminChatTeamPage,
  AdminDashboardPage,
  AdminLikeCommentPage,
  AdminProxyNewPage,
  CommentListPage,
} from "@/pages"
import AdminAffiliatePage from "@/pages/admin/AdminAffiliatePage"
import AdminProxyStatPage, { AdminProxyPage } from "@/pages/admin/AdminProxyStatPage"
import AdminProxyAgencyPage from "@/pages/admin/AdminProxyAgencyPage"
import AdminModelPage from "@/pages/admin/AdminModelPage"
import AdminModelContentPage from "@/pages/admin/AdminModelContentPage"
import AdminAccountHistoryPage from "@/pages/admin/AdminAccountHistoryPage"
import AdminAccountPage from "@/pages/admin/AdminAccountPage"
import AdminFinancePage from "@/pages/admin/AdminFinancePage"
import AdminSchedulePage from "@/pages/admin/AdminSchedulePage"
import { AdminLikeBotPage } from "@/pages/admin/AdminLikeBotPage"

const adminRoutes = [
  { key: "admin_dashboard", path: "/admin/dashboard", component: <AdminDashboardPage />, },
  { key: "admin_agency", path: "/admin/agency", component: <AdminAgencyListPage />, },
  { key: "admin_model", path: "/admin/model", component: <AdminModelPage />, },
  { key: "admin_content", path: "/admin/model/:modelId", component: <AdminModelContentPage />, },
  { key: "admin_account", path: "/admin/account/:platform", component: <AdminAccountPage />, },
  { key: "admin_history", path: "/admin/history/:platform/:accountId", component: <AdminAccountHistoryPage /> },
  { key: "admin_comment", path: "/admin/comment", component: <CommentListPage />, },
  { key: "admin_schedule", path: "/admin/schedule", component: <AdminSchedulePage />, },
  { key: "admin_like", path: "/admin/like/:platform", component: <AdminLikeBotPage />, },
  { key: "admin_like_comment", path: "/admin/like_comment", component: <AdminLikeCommentPage />, },
  { key: "admin_proxy", path: "/admin/proxy", component: <AdminProxyStatPage />, },
  { key: "admin_proxy_new", path: "/admin/proxy_new", component: <AdminProxyNewPage />, },
  { key: "admin_agency_proxy", path: "/admin/proxy/:agencyId", component: <AdminProxyAgencyPage />, },
  { key: "admin_chat", path: "/admin/chat", component: <AdminChatTeamPage />, },
  { key: "admin_finance", path: "/admin/finance/:key", component: <AdminFinancePage />, },
  { key: "admin_affiliate", path: "/admin/affiliate", component: <AdminAffiliatePage />, },
]


export default adminRoutes