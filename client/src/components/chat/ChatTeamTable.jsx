import {
    Button,
    Card,
    Flex,
    Space,
    Table,
    Tooltip,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";

export const ChatTeamTable = ({
    pagination,
    rowSelection,
    loading,
    dataSource,
    actions: {
        onDelete,
        onCreate,
        onEdit,
        onBulkDelete,
    }
}) => {

    const columns = [
        {
            key: 'name',
            title: 'Name',
            width: 150,
            dataIndex: 'name',
            render: (value) => value
        },
        {
            key: 'discord',
            title: 'Discord Web Hook',
            dataIndex: 'discord'
        },
        {
            key: 'accounts',
            title: 'Accounts',
            width: 200,
            dataIndex: 'accounts',
            render: (value) => value.length == 0 ? '-' : `${value.length} accounts`
        },
        {
            key: 'operation',
            title: 'Operation',
            width: 200,
            render: (_, record) => (
                <Flex gap="large">
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit && onEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => onDelete && onDelete(record)} />
                    </Tooltip>
                </Flex>
            )
        },
    ]

    return (
        <Card
            title={<div>Chat Teams List</div>}
            extra={
                <Space align="center">
                    <Button
                        icon={<PlusOutlined />}
                        onClick={onCreate}>
                        Create
                    </Button>
                </Space>
            }>
            <Space align='center' size="middle">
                {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
                    <>
                        <h3>Bulk Actions : </h3>
                        <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={onBulkDelete}>
                            {`Delete ${rowSelection.selectedRowKeys.length} chat teams`}
                        </Button>
                    </>
                }
            </Space>
            <Table
                pagination={{
                    ...pagination,
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} teams`,
                }}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={row => row._id}
                columns={columns}
                dataSource={dataSource}
            />
        </Card>
    )
};

export default ChatTeamTable;