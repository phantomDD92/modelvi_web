import { DatePicker, Form, Modal } from "antd";
import dayjs from 'dayjs';

const ScheduleRetryDialog = ({ open, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  const handleOkClick = async () => {
    try {
      await form.validateFields();
      const { scheduledAt } = form.getFieldsValue();
      onConfirm && onConfirm(scheduledAt.toDate());
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal
      title={"Retry Scheduled Posting"}
      width={600}
      open={open}
      onOk={handleOkClick}
      onCancel={onCancel}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          scheduledAt: dayjs().add(30, "minute"),
        }}>
        <Form.Item
          label="Date/Time"
          name="scheduledAt"
          rules={[{ required: true }]}
        >
          <DatePicker showTime />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ScheduleRetryDialog;