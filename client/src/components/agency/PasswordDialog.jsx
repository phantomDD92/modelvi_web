import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PasswordDialog = ({ agency, open, onCancel, onUpdate }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [open]);

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const { password, confirmPassword } = form.getFieldsValue();
                if (password != confirmPassword) {
                    toast.error("password is mismatched");
                    form.resetFields();
                    return;
                }
                onUpdate(agency, password)
            })
            .catch(() => { });
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <Modal
            title={"Reset Password"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="reset"
            >
                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[{ required: true }]}>
                    <Input allowClear type="password"/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{ required: true }]}>
                    <Input allowClear type="password"/>
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default PasswordDialog;