import React from "react";
import { Layout, Menu, Typography } from "antd";
import routes from "@/routes";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const SiderBar = () => {
    const currentKey = window.location.pathname ? window.location.pathname.split("/")[1] || "dashboard" : "dashboard"
    const navigate = useNavigate();
    const auth = useSelector(state => state.home.auth);
    return (
        <Layout.Sider
            breakpoint="lg"
            collapsedWidth="0"
            theme="light"
        >
            <div className="h-16 flex items-center justify-center">
                <Typography className="text-3xl">Model<b>VI</b></Typography>
            </div>
            <Menu
                className="text-base"
                mode="inline"
                defaultSelectedKeys={[currentKey]}
                onSelect={({ item }) => {
                    navigate(item.props.link);
                }}
                items={routes.filter(route => route.mode === "main" && (!route.visible || route.visible(auth))).map(({ visible, ...data }) => ({ ...data }))} />
        </Layout.Sider>
    )
}


export default SiderBar;