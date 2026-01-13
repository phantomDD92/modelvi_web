import { DatePicker, Form, Modal } from "antd";
import dayjs from 'dayjs';
import moment from "moment";
import { useEffect } from "react";

const ScheduleRetryDialog = ({ open, data, onCancel, onConfirm }) => {
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

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({scheduledAt: moment(data.scheduledAt).isBefore(moment()) ? moment().add(2, "hour").startOf("hour") : moment(data.scheduledAt)})
    }
  }, [open, data]);

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
        >
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