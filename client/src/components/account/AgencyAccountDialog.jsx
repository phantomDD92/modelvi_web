import { Platform } from "@/utils/const";
import { Modal, Form, Select } from "antd";
import { useEffect } from "react";
import StyledInput from "../common/StyledInput";

const AgencyAccountDialog = ({ open, platform, models, chatTeams, account, onCancel, onCreate, onUpdate }) => {
    const [form] = Form.useForm();

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
            title={account ? "Update account" : "Create account"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="account-form" >
                <Form.Item
                    name="actor"
                    label="Model"
                    rules={[{ required: true }]}>
                    <Select
                        options={models ? models.map(model => ({
                            label: `${model.number}. ${model.name}`,
                            value: model._id
                        })) : []}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
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
                            label: team.name,
                            value: team._id
                        }))} />
                </Form.Item>
                {((platform == Platform.FAN) || (platform == Platform.FNC) || (platform == Platform.KNKY)) &&
                    <Form.Item
                        name="device"
                        label={(platform == Platform.KNKY) ? "Magic Link" : "Security Key"} >
                        <StyledInput />
                    </Form.Item>
                }
            </Form>
        </Modal>
    )
}

export default AgencyAccountDialog;