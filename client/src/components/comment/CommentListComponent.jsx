import { Button, Card, List, Flex, Input } from "antd";
import React, { useState } from "react";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

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
      <Flex className="mb-3">
        <Input
          value={comment}
          onChange={e => setComment(e.target.value)}
          onPressEnter={handleAddClick} />
        <Button
          icon={<PlusOutlined />}
          onClick={handleAddClick}>Add</Button>
      </Flex>
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