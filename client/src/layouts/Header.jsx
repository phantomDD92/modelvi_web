import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Layout, Avatar, Popover, Menu, Modal, Form, Typography, Flex, theme, Alert } from "antd";

import { useAuth } from "@/contexts";
import StyledInput from "@/components/common/StyledInput";
import { AdminRole } from "@/utils/const";
import { getFiatAmount } from "@/utils/string";
import { changePassword } from "@/redux/v2/actions";
import { LuKey, LuLogOut, LuSettings2 } from "react-icons/lu";

const HeaderBar = () => {

    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm()

    const { isAuthenticated, session, logout } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const profile = useSelector(state => state.v2.profile);
    const { token: { colorBgContainer } } = theme.useToken();
    const items = [
        {
            key: 'settings',
            label: 'Settings',
            icon: <LuSettings2 />,
        },
        {
            key: 'password',
            label: 'Change Password',
            icon: <LuKey />,
        },
        {
            type: "divider",
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LuLogOut />,
        }
    ];

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
        dispatch(changePassword(password, newPassword, () => setVisible(false)));
    }

    return (
        <Layout.Header className="h-16 flex items-center justify-end" style={{ background: colorBgContainer }}>
            <Popover
                title={
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <Avatar
                                size={45}
                                className="bg-green-400"
                                src={session?.role == AdminRole.MANAGER ? "/img/manager.png" : "/img/agency.png"} />
                            <div className="flex flex-col">
                                <Typography>{profile?.email}</Typography>
                                <Typography>{profile?.telegram}</Typography>
                            </div>
                        </div>
                        <Alert message={`Available balance : ${getFiatAmount(profile?.balance, "$0")}`} type="success" />
                    </div>
                }
                content={<Menu items={items} onClick={handleMenuClick} />}
                trigger="hover"
            >
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