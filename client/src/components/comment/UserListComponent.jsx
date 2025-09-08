import { Card, List, Button, Flex, Input } from "antd";
import React, { useState } from "react";
import { PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import { StyledInput } from "../common";

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
      <Flex className="mb-3">
        <StyledInput
          value={alias}
          onChange={e => setAlias(e.target.value)}
          onPressEnter={handleAddClick} />
        <Button
          icon={<PlusOutlined />}
          onClick={handleAddClick}>Add</Button>
      </Flex>
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