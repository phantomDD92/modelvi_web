import { Modal } from "antd";

const ChatTeamDetailDialog = ({
  open,
  team,
  onCancel,
}) => {
  return (
    <Modal
      title={"Chat Team Detail"}
      open={open}
      width={800}
      onCancel={onCancel}>
      Chat Team Detail
    </Modal>
  )
}

export default ChatTeamDetailDialog;