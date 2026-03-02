import { Modal, Form, InputNumber } from "antd";

const AgencyDueDateDialog = ({
    open,
    agency,
    onCancel,
    onUpdate,
}) => {

    const [form] = Form.useForm();

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const { duedate } = form.getFieldsValue();
                onUpdate && onUpdate(duedate);
            })
            .catch(() => { });
    }


    return (
        <Modal
            title={agency ? `Add agency( ${agency.name} )'s balance` : "Add agency's balance"}
            open={open}
            width={800}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                form={form}
                name="duedate"
                initialValues={{
                    duedate: agency?.dueDate || 1,
                }}
            >
                <Form.Item
                    name="duedate"
                    label="Due Date"
                    rules={[{ required: true }]}>
                    <InputNumber max={30} min={1} />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default AgencyDueDateDialog;