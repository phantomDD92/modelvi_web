import { Modal, Form, InputNumber } from "antd";

const AgencyBalanceDialog = ({
    open,
    agency,
    onCancel,
    onAppend,
}) => {

    const [form] = Form.useForm();

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const { balance } = form.getFieldsValue();
                console.log(balance)
                if (balance > 0)
                    onAppend && onAppend(balance);
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
                name="balance"
                initialValues={{
                    balance: 0,
                }}
            >
                <Form.Item
                    name="balance"
                    label="Balance"
                    rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default AgencyBalanceDialog;