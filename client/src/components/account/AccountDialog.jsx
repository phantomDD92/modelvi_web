import { Platform } from "@/utils/const";
import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";

const AccountDialog = ({ open, platform, models, account, onCancel, onCreate, onUpdate }) => {
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
            form.setFieldsValue({ ...account, actor: account.actor._id })
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
                        disabled={account}
                    />
                </Form.Item>
                <Form.Item
                    name="alias"
                    label="Alias"
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                {platform == Platform.FAN &&
                    <Form.Item
                        name="device"
                        label="Device Id" >
                        <Input />
                    </Form.Item>
                }
            </Form>
        </Modal>

    )
}

export default AccountDialog;