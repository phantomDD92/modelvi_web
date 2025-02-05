import React, { useEffect } from "react";
import { Modal, Input, Form } from "antd";
import { createChatTeam, updateChatTeam } from "@/redux/model/actions";
import { useDispatch } from "react-redux";

const ChatTeamDialog = ({ open, team, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      team ? form.setFieldsValue(team)
        : form.resetFields()
    }
  }, [open, team]);

  const handleUpdate = () => {
    const { name, discord } = form.getFieldsValue()
    if (team)
      dispatch(updateChatTeam(team, { name: name.trim(), discord: discord.trim() }, () => onUpdate && onUpdate()))
    else
      dispatch(createChatTeam({ name: name.trim(), discord: discord.trim() }, () => onUpdate && onUpdate()));
  }

  return (
    <Modal
      title={team ? "Edit Chat Team" : "Create Chat Team"}
      open={open}
      width={800}
      onOk={handleUpdate}
      onCancel={() => onCancel && onCancel()}>
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
      >
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="discord" label="Discord Web Hook" rules={[{ required: true }]}>
          <Input.TextArea
            autoSize={{ minRows: 3 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChatTeamDialog