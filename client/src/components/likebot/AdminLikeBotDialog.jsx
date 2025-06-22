import { Modal, Form, Row, Col } from "antd";
import StyledInput from "../common/StyledInput";

const AdminLikeBotDialog = ({
  open,
  onCancel,
  onCreate,
}) => {

  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (agency) {
  //     form.setFieldsValue(agency)
  //   } else {
  //     form.resetFields();
  //   }
  // }, [agency]);

  const handleOkClick = () => {
    form.validateFields()
      .then(() => {
        // if (agency) {
        //   const params = form.getFieldsValue();
        //   onUpdate && onUpdate(agency, params);
        // } else {
        const params = form.getFieldsValue();
        onCreate && onCreate(params);
        // }
      })
      .catch(() => { });
  }

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      title={"Create Like Bot"}
      open={open}
      width={500}
      onOk={handleOkClick}
      onCancel={onCancel}>
      <Form
        {...layout}
        form={form}
        name="bot"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true }]}>
              <StyledInput />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email" >
              <StyledInput />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="password"
              label="Email Password" >
              <StyledInput />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </Modal>
  )
}

export default AdminLikeBotDialog;