import React from "react"
import {
    AgencyDashboardPage,
    AgencyModelPage,
    AgencyModelContentPage,
    AgencyAccountPage,
    AgencyAccountHistoryPage,
    AgencyProxyPage,
    CommentListPage,
    BillingPage,
    AgencyChatTeamPage,
    AgencyGuidePage,
} from "@/pages";
import AffiliatePage from "@/pages/agency/AffiliatePage";
import AgencySchedulePage from "@/pages/agency/AgencySchedulePage";
import AgencyImportContentPage from "@/pages/agency/AgencyImportContentPage";

const routes = [
    { key: "dashboard", path: "/dashboard", component: <AgencyDashboardPage />, },
    { key: "guide", path: "/guide", component: <AgencyGuidePage />, },
    { key: "model", path: "/model", component: <AgencyModelPage />, },
    { key: "content", path: "/model/:modelId", component: <AgencyModelContentPage />, },
    { key: "import", path: "/import", component: <AgencyImportContentPage />, },
    { key: "account", path: "/account/:platform", component: <AgencyAccountPage />, },
    { key: "history", path: "/history/:platform/:accountId", component: <AgencyAccountHistoryPage /> },
    { key: "chat", path: "/chat", component: <AgencyChatTeamPage />, },
    { key: "schedule", path: "/schedule", component: <AgencySchedulePage />, },
    { key: "comment", path: "/comment", component: <CommentListPage />, },
    { key: "proxy", path: "/proxy", component: <AgencyProxyPage />, },
    { key: "billing", path: "/billing/:key", component: <BillingPage />, },
    { key: "affiliate", path: "/affiliate", component: <AffiliatePage />, },
]

export default routes