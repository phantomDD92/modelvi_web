import { Modal, Form, InputNumber } from "antd";
import { useEffect } from "react";

const AgencyCommissionDialog = ({
    open,
    agency,
    onCancel,
    onUpdate,
}) => {

    const [form] = Form.useForm();

    useEffect(() => {
        if (agency && open) {
            form.setFieldsValue({ commission: agency.commission || 10 })
        } else {
            form.resetFields();
        }
    }, [open, agency]);

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const { commission } = form.getFieldsValue();
                onUpdate && onUpdate(commission);
            })
            .catch(() => { });
    }

    return (
        <Modal
            title={`Change  ${agency?.name || 'agency'}'s commission rate`}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                form={form}
                name="commission"
                initialValues={{
                    balance: 0,
                }}
            >
                <Form.Item
                    name="commission"
                    label="Commission Rate"
                    rules={[{ required: true }]}>
                    <InputNumber min={1} max={50} />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default AgencyCommissionDialog;