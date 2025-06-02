import { Platform } from "@/utils/const";
import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import StyledInput from "../common/StyledInput";
import { AgencySelect } from "../agency";
import { getPlatformName } from "@/utils/string";

const AdminAccountDialog = ({ open, platform, agencies, models, chatTeams, account, onCancel, onCreate, onUpdate }) => {
    const [form] = Form.useForm();
    const [agency, setAgency] = useState('');
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const params = form.getFieldsValue();
            if (account) {
                onUpdate(account, params);
            } else {
                onCreate(params);
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        if (account && open) {
            form.setFieldsValue({ ...account, actor: account.actor._id, chatTeam: account.chatTeam?._id })
        } else {
            form.resetFields();
        }
    }, [open]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    return (
        <Modal
            title={account ? `Update ${getPlatformName(platform)} - ${account.alias} account` : `Create ${getPlatformName(platform)} account`}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="account-form" >
                <Form.Item label="Agency">
                    <AgencySelect
                        dataSource={agencies}
                        value={agency}
                        onChange={value => setAgency(value)}
                        disabled={account} />
                </Form.Item>
                <Form.Item
                    name="actor"
                    label="Model"
                    rules={[{ required: true }]}>
                    <Select
                        options={(models || [])
                            .filter(model => agency == '' || model.owner?._id == agency)
                            .map(model => ({
                                label: `${model.number}. ${model.name}`,
                                value: model._id
                            }))}
                        disabled={account}
                    />
                </Form.Item>
                <Form.Item
                    name="alias"
                    label="Alias"
                    rules={[{ required: true }]}>
                    <StyledInput />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={platform == Platform.KNKY ? [] : [{ required: true }]}>
                    <StyledInput />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={platform == Platform.KNKY ? [] : [{ required: true }]}>
                    <StyledInput />
                </Form.Item>
                <Form.Item
                    name="chatTeam"
                    label="Chat Team">
                    <Select
                        allowClear
                        options={chatTeams.map(team => ({
                            label: `[${team.owner?.name || "Admin"}] ${team.name}`,
                            value: team._id
                        }))} />
                </Form.Item>
                {((platform == Platform.FAN) || (platform == Platform.KNKY)) &&
                    <Form.Item
                        name="device"
                        label={(platform == Platform.FAN) ? "Security Key" : "Magic Link"} >
                        <StyledInput />
                    </Form.Item>
                }
            </Form>
        </Modal>
    )
}

export default AdminAccountDialog;