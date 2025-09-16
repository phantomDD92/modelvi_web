import { Card, List, Button, Flex, Input } from "antd";
import React, { useState } from "react";
import { PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import { StyledInput, StyledSearch } from "../common";

const UserListComponent = ({ title, users = [], onAppend, onDelete }) => {
  const [alias, setAlias] = useState('');
  const handleAddClick = () => {
    if (alias != "" && onAppend) {
      onAppend(alias);
      setAlias("");
    }
  }
  return (
    <Card title={title}>
      <StyledSearch
        value={alias}
        onChange={e => setAlias(e.target.value)}
        onSearch={handleAddClick}
        enterButton={
          <Button
            type="primary"
            icon={<PlusOutlined />}>
            Add
          </Button>}
      />
      <List
        dataSource={users}
        pagination={{
          pageSize: 10,
          showTotal: total => `Total users : ${total}`
        }}
        renderItem={({ _id, alias }) => (
          <List.Item key={`${_id}`}
            actions={[<Button danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => onDelete && onDelete(_id)} />]}>
            {alias}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default UserListComponent;