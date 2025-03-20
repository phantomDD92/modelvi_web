import React, { useEffect, useState } from "react";
import { Layout, Avatar, Popover, Menu, Modal, Form, Input, Typography, Flex, theme } from "antd";
import { LogoutOutlined, KeyOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, logoutManager, reloadManager } from "@/redux/dashboard/actions";
import { useNavigate } from "react-router-dom";
import { AdminRole } from "@/utils/const";
import StyledInput from "@/components/common/StyledInput";
import { useAuth } from "@/contexts";

const HeaderBar = () => {

    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm()

    const { isAuthenticated, session, logout } = useAuth();

    const dispatch = useDispatch();
    const navigate = useNavigate()

    console.log("@@@" , session);
    const { token: { colorBgContainer } } = theme.useToken();
    const items = [{
        label: 'Change Password',
        key: 'password',
        icon: <KeyOutlined />,
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: <LogoutOutlined />,
    }]

    // useEffect(() => {
    //     dispatch(reloadManager(homeProps.token));
    // }, [homeProps.auth.name])
    useEffect(() => {
        if (!isAuthenticated)
            navigate("/sign-in");
    }, [isAuthenticated])

    const handleMenuClick = (e) => {
        if (e.key === "password") {
            form.resetFields();
            setVisible(true);
        } else if (e.key === "logout") {
           logout(() => navigate("/sign-in"));
        }
    }

    const handleChangePassword = () => {
        const { password, newPassword } = form.getFieldsValue()
        dispatch(changePassword(session?.name, password, newPassword));
        setVisible(false);
    }

    return (
        <Layout.Header className="h-16 flex items-center justify-end" style={{ background: colorBgContainer }}>
            <Popover content={
                <Menu items={items} onClick={handleMenuClick} />
            }
                trigger="hover">
                <Flex gap="middle" align="center">
                    <Avatar
                        size="large"
                        className="bg-green-400"
                        src={session?.role == AdminRole.MANAGER ? "/img/manager.png" : "/img/agency.png"}
                    />
                    <Typography className="text-lg">{session?.name}</Typography>
                </Flex>
            </Popover>
            <Modal
                title="Change Password"
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={handleChangePassword}
            >
                <Form
                    layout="vertical"
                    form={form}
                >
                    <Form.Item name="password" label="Current Password" rules={[{ required: true }]}>
                        <StyledInput type="password" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
                        <StyledInput type="password" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout.Header>
    )
}

export default HeaderBar