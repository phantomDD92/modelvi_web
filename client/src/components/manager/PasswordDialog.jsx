import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

const PasswordDialog = ({ agency, open, onCancel, onUpdate }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [open]);

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { password } = form.getFieldsValue();
            onUpdate(agency, password)
        } catch (e) {

        }
    }

    return (
        <Modal
            title={"Reset Password"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                layout="vertical"
                form={form}
                name="reset"
            >
                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[{ required: true }]}>
                    <Input allowClear />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default PasswordDialog;