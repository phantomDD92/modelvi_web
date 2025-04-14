import React from "react"
import {
    DashboardPage,
    ModelListPage,
    ModelContentPage,
    AccountListPage,
    AccountHistoryPage,
    AgencyProxyPage,
    CommentListPage,
    BillingPage,
} from "@/pages";
import AffiliatePage from "@/pages/agency/AffiliatePage";

const routes = [
    { key: "dashboard", path: "/", component: <DashboardPage />, },
    { key: "model", path: "/model", component: <ModelListPage />, },
    { key: "content", path: "/model/:modelId", component: <ModelContentPage />, },
    { key: "account", path: "/account/:platform", component: <AccountListPage />, },
    { key: "history", path: "/account/:platform/:accountId", component: <AccountHistoryPage /> },
    { key: "comment", path: "/comment", component: <CommentListPage />, },
    { key: "proxy", path: "/proxy", component: <AgencyProxyPage />, },
    { key: "billing", path: "/billing/:key", component: <BillingPage />, },
    { key: "affiliate", path: "/affiliate", component: <AffiliatePage />, },
]

export default routes