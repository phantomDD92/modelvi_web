import { Modal, Form, Row, Col, Input } from "antd";

const AdminLikeBotDialog = ({
  open,
  onCancel,
  onAppend,
}) => {

  const [form] = Form.useForm();

  const handleOkClick = () => {
    form.validateFields()
      .then(() => {
        const { usersText } = form.getFieldsValue();
        const userInfos = usersText.split("\n").map(userText => userText.trim().split(","));
        const users = userInfos
          .filter(userInfo => userInfo.length == 4)
          .map(userInfo => ({
            firstName: userInfo[0].trim(),
            lastName: userInfo[1].trim(),
            gender: userInfo[2].trim(),
            birthday: userInfo[3].trim(),
          }));
        onAppend && onAppend(users);
      })
      .catch(() => { });
  }

  return (
    <Modal
      title={"Append Like Bots"}
      open={open}
      width={500}
      onOk={handleOkClick}
      onCancel={onCancel}>
      <Form
        // {...layout}
        layout="vertical"
        form={form}
        name="bot"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              name="usersText"
              label="Users for like bot"
              rules={[{ required: true }]}>
              <Input.TextArea
                placeholder=""
                autoSize={{ minRows: 20, maxRows: 30 }}
                allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AdminLikeBotDialog;