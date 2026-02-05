import { Card, List, Button } from "antd";
import React, { useState } from "react";
import { StyledSearch } from "../common";
import { LuPlus, LuTrash } from "react-icons/lu";

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
            icon={<LuPlus />}>
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
            actions={[<Button danger icon={<LuTrash />} onClick={() => onDelete && onDelete(_id)} />]}>
            {alias}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default UserListComponent;