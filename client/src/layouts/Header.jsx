import React, { useEffect, useState } from "react";
import { Layout, Avatar, Popover, Menu, Modal, Form, Input, Typography, Flex } from "antd";
import { LogoutOutlined, KeyOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, logoutManager, reloadManager } from "@/redux/dashboard/actions";
import { useNavigate } from "react-router-dom";
import { AdminRole } from "@/utils/const";

const HeaderBar = () => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm()
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home)
    const navigate = useNavigate()
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
    useEffect(() => {
        dispatch(reloadManager(homeProps.token));
    }, [homeProps.auth.name])

    const handleMenuClick = (e) => {
        if (e.key === "password") {
            form.resetFields();
            setVisible(true);
        } else if (e.key === "logout") {
            dispatch(logoutManager())
            navigate("/")
        }
    }
    const handleChangePassword = () => {
        const { password, newPassword } = form.getFieldsValue()
        dispatch(changePassword(homeProps.auth.name, password, newPassword));
        setVisible(false);
    }

    return (
        <Layout.Header className="h-16 flex items-center justify-end">
            <Popover content={
                <Menu items={items} onClick={handleMenuClick} />
            }
                trigger="hover">
                <Flex gap="middle" align="center">
                    <Avatar
                        size="large"
                        className="bg-green-400"
                        src={homeProps.auth.role == AdminRole.MANAGER ? "/img/manager.png" : "/img/agency.png"}
                    />
                    <span style={{color:"white", fontSize: "1.15rem"}}>{homeProps.auth.name}</span>
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
                        <Input type="password" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
                        <Input type="password" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout.Header>
    )
}

export default HeaderBar