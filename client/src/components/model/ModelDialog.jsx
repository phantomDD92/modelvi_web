import { Modal, Form, Input, Row, Col, InputNumber, DatePicker } from "antd";
import { useEffect } from "react";

const ModelDialog = ({ open, model, onCancel, onCreate, onUpdate }) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            if (model) {
                const params = form.getFieldsValue();
                onUpdate(model, params);
            } else {
                const { password, passwordConfirm, ...params } = form.getFieldsValue()
                if (password != passwordConfirm) {
                    toast.error("please confirm password, correctly");
                    return
                }
                onCreate({ password, ...params });
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        if (model) {
            form.setFieldsValue(model)
        } else {
            form.resetFields();
        }
    }, [model]);

    return (
        <Modal
            title={model ? "Update model" : "Create model"}
            width={600}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="model"
            >
                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            name="number"
                            label="No."
                            rules={[{ required: true }]}>
                            <InputNumber min={1} max={1000} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            name="birthday"
                            label="Birthday">
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="birthplace"
                            label="Birth Place">
                            <Input placeholder="German"/>
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row>
                    <Col span={24}>
                        <Form.Item labelCol={8} wrapperCol={16} name="description" label="Bio" >
                            <Input.TextArea autoSize={{ minRows: 5, maxRows: 20 }} />
                        </Form.Item>
                    </Col>
                </Row> */}
            </Form>
        </Modal>
    )
}

export default ModelDialog;