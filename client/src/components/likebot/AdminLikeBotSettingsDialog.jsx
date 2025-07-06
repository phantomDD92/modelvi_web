import { Modal, Form, Row, Col, InputNumber } from "antd";
import { useEffect } from "react";

const AdminLikeBotSettingsDialog = ({ open, settings, model, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const params = form.getFieldsValue();
                onUpdate && onUpdate(params);
            })
            .catch(() => { });

    }
    useEffect(() => {
        if (open)
            form.setFieldsValue(settings.params)
    }, [open, settings]);

    return (
        <Modal
            title="Like Bot Settings"
            width={450}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="like-bot-settings"
                initialValues={{
                    followInterval: 12,
                    likeInterval: 20,
                    likeLimit: 2,
                }}
            >
                <Row gutter={20}>
                    <Col span={24}>
                        <Form.Item
                            name="followInterval"
                            label="Following Interval"
                            rules={[{ required: true }]}>
                            <InputNumber min={1} max={24} suffix="hours" className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="likeInterval"
                            label="Liking Interval"
                            rules={[{ required: true }]}>
                            <InputNumber min={10} max={60} suffix="minutes" className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="likeLimit"
                            label="Liking Limit Count"
                            rules={[{ required: true }]}>
                            <InputNumber min={1} max={10} suffix="posts" className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default AdminLikeBotSettingsDialog;