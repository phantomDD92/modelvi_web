import { Card, Table, Button, Space } from "antd";
import { LuPlus, LuTrash } from "react-icons/lu";

export const AdminLikeCommentTable = ({
  pagination,
  rowSelection,
  dataSource,
  loading,
  actions: {
    onBulkDelete,
    onDelete,
    onAppend,
  },
}) => {
  const columns = [
    {
      key: 'comment',
      title: 'Comment',
      dataIndex: 'text',
    },
    {
      key: 'action',
      title: 'Action',
      width: 200,
      render: (_, record) =>
        <Button
          icon={<LuTrash />}
          danger
          onClick={() => onDelete && onDelete(record)}>
          Delete
        </Button>
    },
  ]

  return (
    <Card
      title="Comment List"
      extra={
        <Button
          icon={<LuPlus />}
          onClick={() => onAppend && onAppend()}>
          Create
        </Button>}
    >
      <Space align='center' size="middle">
        {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
          <>
            <h3>Bulk Actions : </h3>
            <Button
              key="delete"
              icon={<LuTrash />}
              danger
              onClick={onBulkDelete}>
              {`Delete ${rowSelection.selectedRowKeys.length} comments`}
            </Button>
          </>
        }
      </Space>
      <Table
        pagination={{
          ...pagination,
          position: ["topRight", "bottomRight"],
          showTotal: total => `Total ${total} agencies`,
        }}
        loading={loading}
        rowSelection={rowSelection}
        rowKey={row => row._id}
        dataSource={dataSource}
        columns={columns}
      />
    </Card>
  )
};

export default AdminLikeCommentTable;