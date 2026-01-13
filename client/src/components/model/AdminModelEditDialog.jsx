import { useEffect } from "react";
import { Modal, Form, Row, Col, InputNumber } from "antd";
import StyledInput from "../common/StyledInput";
import { AgencySelect } from "../agency";

const AdminModelEditDialog = ({ open, model, agencies, onCancel, onCreate, onUpdate }) => {
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
                    onUpdate && onUpdate(params)
                else
                    onCreate && onCreate(params)
            })
            .catch(() => { });
    }

    useEffect(() => {
        if (open) {
            if (model) {
                form.setFieldsValue({ name: model.name, number: model.number, agency: model.owner?._id })
            } else {
                form.resetFields();
            }
        }
    }, [open, model]);

    return (
        <Modal
            title={model ? `Edit ${model.name}` : "Create model"}
            width={450}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="model">
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
                            name="agency"
                            label="Owner"
                            rules={[{ required: true }]}>
                            <AgencySelect dataSource={agencies} />
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

export default AdminModelEditDialog;