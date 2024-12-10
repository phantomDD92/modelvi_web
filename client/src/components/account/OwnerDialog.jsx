import { loadAgencies } from "@/redux/dashboard/actions";
import { Modal, Form, Select } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const OwnerDialog = ({ open, model, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const params = form.getFieldsValue();
            onUpdate(model, params);
        } catch (e) {

        }
    }
    useEffect(() => {
        if (model && open) {
            console.log(model);
            form.setFieldsValue({ agency: model.owner?._id })
        } else {
            form.resetFields();
        }
    }, [open, model]);

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
                    name="agency"
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