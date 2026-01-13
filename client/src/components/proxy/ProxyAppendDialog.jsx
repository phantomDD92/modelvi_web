import React, { useEffect } from "react";
import {
    DatePicker,
    Form,
    Input,
    Modal,
} from "antd";

const ProxyDialog = ({ open, onCancel, onAppend }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [open]);

    const handleOkClick = () => {
        form.validateFields().then(() => {
            const { proxiesText, expiredAt } = form.getFieldsValue();
            const proxies = []
            proxiesText.split("\n").forEach(entry => {
                if (entry.trim() !== "") {
                    proxies.push(entry.trim())
                }
            })
            onAppend && onAppend(proxies, expiredAt.toDate())
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
                name="agency"
                initialValues={{
                    proxies: "",
                }}
            >
                <Form.Item
                    name="proxiesText"
                    label="Proxies"
                    rules={[{ required: true }]}>
                    <Input.TextArea
                        placeholder="username:password@ip:port"
                        autoSize={{ minRows: 20, maxRows: 30 }}
                        allowClear />
                </Form.Item>
                <Form.Item
                    name="expiredAt"
                    label="Expiration" >
                    <DatePicker />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default ProxyDialog;