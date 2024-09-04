import { Modal, Form, Input, Switch, InputNumber } from "antd";
import { useEffect } from "react";

const F2FParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const {postOffsets, ...params} = form.getFieldsValue();
            const offsets = postOffsets ? postOffsets.split(",").map(str => parseInt(str.trim())) : [1, 21, 51];
            onUpdate(account, {...params, postOffsets: offsets});
        } catch (e) {

        }
    }
    useEffect(() => {
        if (open && account && account.params) {
            const { commentInterval, notifyInterval, postOffsets, debug } = account.params;
            form.setFieldsValue({
                commentInterval: commentInterval || 3,
                notifyInterval: notifyInterval || 3,
                debug: debug || false,
                postOffsets: postOffsets ? postOffsets.join(",") : "1, 21, 51"
            });
        }
    }, [open]);
    return (
        <Modal
            title={"F2F Account Setting"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="f2f-setting"
            >
                <Form.Item
                    name="commentInterval"
                    label="Comment Interval"
                    rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="notifyInterval"
                    label="Notify Interval"
                    rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="postOffsets"
                    label="Post Offsets"
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="debug"
                    label="Debug Enabled"
                    rules={[{ required: true }]}>
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default F2FParamDialog;