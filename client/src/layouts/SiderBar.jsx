import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts";
import { adminMenus, agencyMenus } from "./SideMenus";
import { LuCommand } from "react-icons/lu";

const SiderBar = () => {
    const location = useLocation();
    const [isAdmin, setAdmin] = useState(false);
    const [key, setKey] = useState('dashboard');

    useEffect(() => {
        const pathname = location.pathname;
        const segments = pathname.split("/");
        if (segments[1] == "admin") {
            setAdmin(true);
            setKey(`admin_${segments[2] || "dashboard"}`)
        } else {
            setAdmin(false)
            setKey(segments[1] || "dashboard")
        }
    }, [location.pathname])
    const { session } = useAuth();
    return (
        <Layout.Sider
            breakpoint="lg"
            collapsedWidth="0"
            theme="light">
            <div className="h-16 flex items-center justify-center">
                <Typography className="text-3xl">Model<b>VI</b></Typography>
            </div>
            <Menu
                className="text-base"
                mode="inline"
                selectedKeys={[key]}
                items={isAdmin
                    ? session.name == "Eric"
                        ? [...adminMenus, { key: "admin_command", icon: <LuCommand />, label: <Link to="/admin/command">Command</Link> }]
                        : adminMenus
                    : agencyMenus.filter(menu => !menu.visible || menu.visible(session?.role))
                }
            />
        </Layout.Sider>
    )
}


export default SiderBar;