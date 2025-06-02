import React, { useEffect } from "react";
import {
  Form,
  Input,
  Modal,
} from "antd";
import StyledInput from "../common/StyledInput";
import toast from "react-hot-toast";

const ChatTeamDialog = ({
  open,
  team,
  onCreate,
  onCancel,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      team
        ? form.setFieldsValue(team)
        : form.resetFields()
    }
  }, [open, team]);

  const validateDiscordUrl = (url) => {
    const pattern = /^https:\/\/(canary\.)?discord(app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/;
    return pattern.test(url);
  };

  const handleOkClick = () => {
    form.validateFields()
      .then(() => {
        const { name, discord } = form.getFieldsValue();
        if (!validateDiscordUrl(discord)) {
          toast.error("Invalid Discord webhook url");
          return;
        }
        if (team) {
          onUpdate && onUpdate(team, { name: name.trim(), discord: discord.trim() })
        } else {
          onCreate({ name: name.trim(), discord: discord.trim() });
        }
      })
      .catch(() => { });
  }

  return (
    <Modal
      title={team ? "Edit Chat Team" : "Create Chat Team"}
      open={open}
      width={800}
      onOk={handleOkClick}
      onCancel={onCancel}>
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true }]}>
          <StyledInput />
        </Form.Item>
        <Form.Item
          name="discord"
          label="Discord Web Hook"
          rules={[{ required: true }]}>
          <Input.TextArea
            autoSize={{ minRows: 3 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChatTeamDialog