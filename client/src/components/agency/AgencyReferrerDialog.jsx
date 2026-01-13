import { Modal, Form } from "antd";
import { useEffect } from "react";
import AgencySelect from "./AgencySelect";

const AgencyReferrerDialog = ({ open, agency, agencies, onCancel, onUpdate }) => {
  const [form] = Form.useForm();

  const handleOkClick = async () => {
    try {
      await form.validateFields();
      const { referrer } = form.getFieldsValue();
      onUpdate && onUpdate(referrer);
    } catch (e) {

    }
  }
  useEffect(() => {
    if (agency && open) {
      form.setFieldsValue({ referrer: agency.referrer?._id })
    } else {
      form.resetFields();
    }
  }, [open, agency]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      title={`Change Referrer`}
      open={open}
      onOk={handleOkClick}
      onCancel={onCancel}>
      <Form
        {...layout}
        form={form}
        name="owner-form" >
        <Form.Item
          name="referrer"
          label="Referrer"
          rules={[{ required: true }]}>
          <AgencySelect
            dataSource={agencies}
          />
        </Form.Item>
      </Form>
    </Modal>

  )
}

export default AgencyReferrerDialog;