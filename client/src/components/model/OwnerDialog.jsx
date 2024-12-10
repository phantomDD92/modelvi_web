import { loadAgencies } from "@/redux/dashboard/actions";
import { Modal, Form, Select } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const OwnerDialog = ({ open, actor, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const params = form.getFieldsValue();
            onUpdate(actor, params);
        } catch (e) {

        }
    }
    useEffect(() => {
        if (actor && open) {
            form.setFieldsValue({ owner: actor.owner?.id })
        } else {
            form.resetFields();
        }
    }, [open, actor]);

    useEffect(() => {
        dispatch(loadAgencies());
    }, [loadAgencies]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    return (
        <Modal
            title={"Change owner"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="owner-form" >
                <Form.Item
                    name="owner"
                    label="Agency"
                    rules={[{ required: true }]}>
                    <Select
                        options={homeProps.managers.map(manager => ({
                            label: `${manager.name}`,
                            value: manager._id
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>

    )
}

export default OwnerDialog;