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
            const { commentInterval,postInterval, storyInterval, storyMaxCount, storyReplaceCount } = account.params;
            form.setFieldsValue({
                commentInterval: commentInterval || 6,
                postInterval: postInterval || 30,
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
                <Form.Item name="postInterval" label="Post Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={60} addonAfter="min"/>
                </Form.Item>
                <Form.Item name="commentInterval" label="Comment Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={60} addonAfter="min"/>
                </Form.Item>
                <Form.Item name="storyInterval" label="Story Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={60} addonAfter="min"/>
                </Form.Item>
                <Form.Item name="storyMaxCount" label="Story Max Count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={20} addonAfter="stories"/>
                </Form.Item>
                <Form.Item name="storyReplaceCount" label="Story Replace Count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={10} addonAfter="stories"/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FNCParamDialog;