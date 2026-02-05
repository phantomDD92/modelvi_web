import React, { useState } from "react";
import { Button, Card, List } from "antd";
import { StyledSearch } from "../common";
import { LuPlus, LuTrash } from "react-icons/lu";

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
            icon={<LuPlus />}>
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
          <List.Item key={`${_id}`} actions={[<Button danger icon={<LuTrash />} onClick={() => onDelete && onDelete(_id)} />]}>
            {text}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default CommentListComponent;