import React from "react";
import { Layout, Menu } from "antd";
import routes from "@/routes";
import { useNavigate } from "react-router-dom";
const SiderBar = () => {
    const currentKey = window.location.pathname ? window.location.pathname.split("/")[1] || "dashboard" : "dashboard"
    const navigate = useNavigate();
    return (
        <Layout.Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className="h-16 flex items-center justify-center">
                <span className="text-white text-3xl">CHAT BOTS</span>
            </div>
            <Menu
                className="text-base"
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[currentKey]}
                onSelect={({item}) => {
                    navigate(item.props.link);
                }}
                items={routes.filter(item => item.mode === "main")} />
        </Layout.Sider>
    )
}


export default SiderBar;