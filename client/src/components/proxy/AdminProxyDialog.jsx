import React, { useEffect } from "react";
import {
    Form,
    Input,
    Modal,
} from "antd";

const AdminProxyDialog = ({ open, onCancel, onAppend }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [open]);

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const { proxies: proxiesText } = form.getFieldsValue();
                const proxies = []
                proxiesText.split("\n").forEach(entry => {
                    if (entry.trim() !== "") {
                        proxies.push(entry.trim())
                    }
                })
                onAppend && onAppend(proxies)
            })
            .catch(() => { });
    }

    return (
        <Modal
            title={"Append Proxies"}
            open={open}
            width={700}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                layout="vertical"
                form={form}
                name="proxies"
                initialValues={{
                    proxies: "",
                }}
            >
                <Form.Item
                    name="proxies"
                    label="Proxies"
                    rules={[{ required: true }]}>
                    <Input.TextArea
                        placeholder="username:password@ip:port"
                        autoSize={{ minRows: 20, maxRows: 30 }}
                        allowClear />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default AdminProxyDialog;