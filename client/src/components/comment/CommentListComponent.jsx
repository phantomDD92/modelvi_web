import React, { useState } from "react";
import { Button, Card, List } from "antd";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { StyledSearch } from "../common";

const CommentListComponent = ({ comments, onAdd, onDelete }) => {
  const [comment, setComment] = useState('');
  const handleAddClick = () => {
    if (comment != "") {
      onAdd(comment);
      setComment("");
    }
  }
  return (
    <Card title="Comment List">
      <StyledSearch
        value={comment}
        onChange={e => setComment(e.target.value)}
        onSearch={handleAddClick}
        enterButton={
          <Button
            type="primary"
            icon={<PlusOutlined />}>
            Add
          </Button>}
      />
      <List
        dataSource={comments}
        pagination={{
          pageSize: 10,
          showTotal: total => `Total comments : ${total}`
        }}
        renderItem={({ _id, text }) => (
          <List.Item key={`${_id}`} actions={[<Button danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => onDelete && onDelete(_id)} />]}>
            {text}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default CommentListComponent;