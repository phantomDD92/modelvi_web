import React from "react"
import { UserOutlined, HomeOutlined, SolutionOutlined, SettingOutlined, WomanOutlined, EnvironmentOutlined, DiscordOutlined } from "@ant-design/icons";
import {Home, ProxyList, ModelList, DiscordList, Settings} from "@/pages";
import ManagerList from "./pages/ManagerList";
import AccountList from "./pages/AccountList";
import ModelContent from "./pages/ModelContent";
import AccountHistory from "./pages/AccountHistory";
import ScheduleList from "./pages/ScheduleList";
import { AdminRole } from "./utils/const";

const routes = [
    {
        key: "dashboard",
        path: "/dashboard",
        link: "/dashboard",
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
        component: <ModelList />,
        mode: "main"
    },
    {
        key: "model",
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
        key: "schedule",
        path: "/schedule",
        link: "/schedule",
        label: "Schedules",
        icon: <SolutionOutlined />,
        component: <ScheduleList />,
        mode: "main",
    },
    {
        key: "history",
        path: "/account/:platform/:accountId",
        label: "Account History",
        icon: <SolutionOutlined />,
        component: <AccountHistory />
        // mode: "main"
    },
    // {
    //     key: "comment",
    //     path: "/comment",
    //     label: "Comment",
    //     icon: <MessageOutlined />,
    //     component: <CommentList />,
    //     mode: "main"
    // },
    {
        key: "proxy",
        path: "/proxy",
        label: "Proxy",
        link: "/proxy",
        icon: <EnvironmentOutlined />,
        component: <ProxyList />,
        mode: "main",
    },
    {
        key: "discord",
        path: "/discord",
        link: "/discord",
        label: "Discord",
        icon: <DiscordOutlined />,
        component: <DiscordList />,
        mode: "main",
        visible: auth => auth.role == AdminRole.MANAGER,
    },
    // {
    //     key: "settings",
    //     path: "/settings",
    //     label: "Settings",
    //     icon: <SettingOutlined />,
    //     component: <Settings />,
    //     mode: "main"
    // },
    {
        key: "agency",
        path: "/agency",
        label: "Agency",
        link: "/agency",
        icon: <UserOutlined />,
        component: <ManagerList />,
        mode: "main",
        visible: auth => auth.role == AdminRole.MANAGER,
    },
]

export default routes