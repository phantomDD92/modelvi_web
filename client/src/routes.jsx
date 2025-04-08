import React from "react"
import { UserOutlined, HomeOutlined, SolutionOutlined, EnvironmentOutlined, DiscordOutlined } from "@ant-design/icons";
import { Home, ProxyListPage, ModelListPage, ChatTeamListPage, SettingsPage } from "@/pages";
import AgencyListPage from "./pages/AgencyList";
import AccountList from "./pages/AccountList";
import ModelContent from "./pages/ModelContent";
import AccountHistory from "./pages/AccountHistory";
// import ScheduleList from "./pages/ScheduleList";
import CommentListPage from "./pages/CommentList";
import { AdminRole } from "./utils/const";
import { LuSettings } from "react-icons/lu";

const routes = [
    {
        key: "dashboard",
        path: "/",
        link: "/",
        label: "Dashboard",
        icon: <HomeOutlined />,
        component: <Home />,
        mode: "main",
    },
    {
        key: "model",
        path: "/model",
        link: "/model",
        label: "Model",
        icon: <SolutionOutlined />,
        component: <ModelListPage />,
        mode: "main"
    },
    {
        key: "content",
        path: "/model/:modelId",
        label: "Model Content",
        icon: <SolutionOutlined />,
        component: <ModelContent />,
        // mode: "main"
    },
    {
        key: "account",
        path: "/account/:platform",
        link: "/account/F2F",
        label: "Account",
        icon: <UserOutlined />,
        component: <AccountList />,
        mode: "main"
    },
    {
        key: "history",
        path: "/account/:platform/:accountId",
        label: "Account History",
        icon: <SolutionOutlined />,
        component: <AccountHistory />
        // mode: "main"
    },
    {
        key: "comment",
        path: "/comment",
        label: "Comment",
        link: "/comment",
        icon: <SolutionOutlined />,
        component: <CommentListPage />,
        mode: "main"
    },
    {
        key: "proxy",
        path: "/proxy",
        label: "Proxy",
        link: "/proxy",
        icon: <EnvironmentOutlined />,
        component: <ProxyListPage />,
        mode: "main",
    },
    {
        key: "discord",
        path: "/discord",
        link: "/discord",
        label: "ChatTeam",
        icon: <DiscordOutlined />,
        component: <ChatTeamListPage />,
        mode: "main",
        visible: role => role == AdminRole.MANAGER,
    },
    {
        key: "agency",
        path: "/agency",
        label: "Agency",
        link: "/agency",
        icon: <UserOutlined />,
        component: <AgencyListPage />,
        mode: "main",
        visible: role => role == AdminRole.MANAGER,
    },
    {
        key: "settings",
        path: "/billing/:key",
        label: "Billing",
        link: "/billing/payments",
        icon: <LuSettings />,
        component: <SettingsPage />,
        mode: "main",
    },
]

export default routes