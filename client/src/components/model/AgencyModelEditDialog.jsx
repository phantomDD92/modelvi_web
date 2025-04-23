import { Modal, Form, Row, Col, InputNumber, DatePicker } from "antd";
import moment from "moment";
import { useEffect } from "react";
import StyledInput from "../common/StyledInput";

const AgencyModelEditDialog = ({ open, model, onCancel, onCreate, onUpdate }) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const params = form.getFieldsValue();
                if (model)
                    onUpdate && onUpdate(params);
                else
                    onCreate && onCreate(params);
            })
            .catch(() => { });

    }
    useEffect(() => {
        if (model) {
            form.setFieldsValue({ ...model })
        } else {
            form.resetFields();
        }
    }, [model]);

    return (
        <Modal
            title={model ? `Edit model (${model.name})` : "Create model"}
            width={450}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="model"
            >
                <Row gutter={20}>
                    <Col span={24}>
                        <Form.Item
                            name="number"
                            label="No."
                            rules={[{ required: true }]}>
                            <InputNumber min={1} max={1000} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true }]}>
                            <StyledInput />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default AgencyModelEditDialog;