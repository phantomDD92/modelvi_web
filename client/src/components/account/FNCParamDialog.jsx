import { Modal, Form, Switch, InputNumber } from "antd";
import { useEffect } from "react";

const FNCParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const params = form.getFieldsValue();
            onUpdate(account, params);
        } catch (e) {

        }
    }
    useEffect(() => {
        if (open && account && account.params) {
            const { commentInterval, notifyInterval, postInterval, storyInterval, storyMaxCount, storyReplaceCount, debug } = account.params;
            form.setFieldsValue({
                commentInterval: commentInterval || 6,
                notifyInterval: notifyInterval || 30,
                debug: debug || false,
                postInterval: postInterval || 60,
                storyInterval: storyInterval || 10,
                storyMaxCount: storyMaxCount || 6,
                storyReplaceCount: storyReplaceCount || 1,
            });
        }
    }, [open]);

    return (
        <Modal
            title={"FNC Account Setting"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="control-hooks"
            >
                <Form.Item name="commentInterval" label="Comment Interval" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="notifyInterval" label="Notify Interval" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="storyInterval" label="Story Interval" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="storyMaxCount" label="Story Max Count" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="storyReplaceCount" label="Story Replace Count" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="postInterval" label="Post Interval" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="debug" label="Debug Enabled" rules={[{ required: true }]}>
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FNCParamDialog;