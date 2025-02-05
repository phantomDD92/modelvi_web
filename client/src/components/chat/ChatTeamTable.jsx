import { Card, Table, Tooltip, Popconfirm, Button, Flex } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";

export const ChatTeamTable = ({ loading, teams, teamsCount, page, onPageChange, onDelete, onCreate, onEdit }) => {

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
                        <Button icon={<EditOutlined />} onClick={() => onEdit && onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to delete the chat team?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete && onDelete(record)}
                    >
                        <Tooltip title="Delete">
                            <Button shape="circle" icon={<DeleteOutlined />} danger />
                        </Tooltip>
                    </Popconfirm>
                </Flex>
            )
        },
    ]

    return (
        <Card
            title={<div>Chat Teams List</div>}
            extra={
                <div className="flex gap-4">
                    <Button icon={<PlusOutlined />} onClick={onCreate}>Create</Button>
                </div>
            } >
            <Table
                pagination={{
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} teams`,
                    current: page,
                    total: teamsCount,
                    onChange: onPageChange,
                }}
                loading={loading}
                rowKey={row => row._id}
                columns={columns}
                dataSource={teams}
            />
        </Card>
    )
};

export default ChatTeamTable;