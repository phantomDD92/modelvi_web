import React, { useEffect } from "react";
import {
    Form,
    Input,
    Modal,
} from "antd";

const AdminLikeCommentDialog = ({ open, onCancel, onAppend }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [open]);

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const { commentText } = form.getFieldsValue();
                const comments = commentText.split("\n").map(element => element.trim())
                onAppend && onAppend(comments)
            })
            .catch(() => { });
    }

    return (
        <Modal
            title={"Append Comments"}
            open={open}
            width={700}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                layout="vertical"
                form={form}
                name="proxies"
                initialValues={{
                    commentText: "",
                }}
            >
                <Form.Item
                    name="commentText"
                    label="Comments"
                    rules={[{ required: true }]}>
                    <Input.TextArea
                        autoSize={{ minRows: 20, maxRows: 30 }}
                        allowClear />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default AdminLikeCommentDialog;