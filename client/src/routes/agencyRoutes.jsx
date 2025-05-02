import React from "react"
import {
    DashboardPage,
    AgencyModelPage,
    AgencyModelContentPage,
    AgencyAccountPage,
    AccountHistoryPage,
    AgencyProxyPage,
    CommentListPage,
    BillingPage,
} from "@/pages";
import AffiliatePage from "@/pages/agency/AffiliatePage";
import AgencySchedulePage from "@/pages/agency/AgencySchedulePage";

const routes = [
    { key: "dashboard", path: "/dashboard", component: <DashboardPage />, },
    { key: "model", path: "/model", component: <AgencyModelPage />, },
    { key: "content", path: "/model/:modelId", component: <AgencyModelContentPage />, },
    { key: "account", path: "/account/:platform", component: <AgencyAccountPage />, },
    { key: "history", path: "/history/:platform/:accountId", component: <AccountHistoryPage /> },
    { key: "schedule", path: "/schedule", component: <AgencySchedulePage />, },
    { key: "comment", path: "/comment", component: <CommentListPage />, },
    { key: "proxy", path: "/proxy", component: <AgencyProxyPage />, },
    { key: "billing", path: "/billing/:key", component: <BillingPage />, },
    { key: "affiliate", path: "/affiliate", component: <AffiliatePage />, },
]

export default routes