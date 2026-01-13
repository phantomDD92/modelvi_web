import { Modal, Form, Input, Row, Col, InputNumber } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import StyledInput from "../common/StyledInput";

const AgencyDialog = ({
    open,
    agency,
    onCancel,
    onCreate,
    onUpdate
}) => {

    const [form] = Form.useForm();

    useEffect(() => {
        if (agency) {
            form.setFieldsValue(agency)
        } else {
            form.resetFields();
        }
    }, [agency]);

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                if (agency) {
                    const params = form.getFieldsValue();
                    onUpdate && onUpdate(agency, params);
                } else {
                    const { password, passwordConfirm, ...params } = form.getFieldsValue()
                    if (password != passwordConfirm) {
                        toast.error("please confirm password, correctly");
                        return
                    }
                    onCreate && onCreate({ password, ...params });
                }
            })
            .catch(() => { });
    }

    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };

    return (
        <Modal
            title={agency ? `Edit agency ( ${agency.name} )` : "Create agency"}
            open={open}
            width={800}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="agency"
                initialValues={{
                    maxActors: 3,
                    maxAccounts: 3,
                }}
            >
                <Row>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Agency Name"
                            rules={[{ required: true }]}>
                            <StyledInput />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Agency Email" >
                            <StyledInput />
                        </Form.Item>
                    </Col>
                </Row>
                {!agency &&
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true }]}>
                                <StyledInput type="password" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="passwordConfirm"
                                label="Confirm Password"
                                rules={[{ required: true }]}>
                                <StyledInput type="password" />
                            </Form.Item>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col span={12}>
                        <Form.Item
                            name="maxActors"
                            label="Model Limit"
                            rules={[{ required: true }]}>
                            <InputNumber min={1} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="maxAccounts"
                            label="Account Limit" >
                            <InputNumber min={1} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>

    )
}

export default AgencyDialog;