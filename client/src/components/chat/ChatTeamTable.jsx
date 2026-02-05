import {
    Button,
    Card,
    Flex,
    Space,
    Table,
    Tooltip,
} from "antd";
import { LuPenLine, LuPlus, LuTrash } from "react-icons/lu";

export const ChatTeamTable = ({
    pagination,
    rowSelection,
    loading,
    dataSource: {
        chatTeams,
        chatTeamStats,
    },
    actions: {
        onDelete,
        onCreate,
        onEdit,
        onBulkDelete,
        onDetail,
    }
}) => {
    const getUsage = (teamId) => {
        const team = chatTeamStats.find(team => team._id == teamId);
        if (team)
            return <Space direction="vertical" size={1}><span>{team.actorCount || 0} models</span><span>{team.accountCount || 0} accounts</span></Space>;
        else
            return '-';
    }

    const columns = [
        {
            key: 'name',
            title: 'Name',
            width: 150,
            dataIndex: 'name',
            render: (value, record) => <Button type="link" onClick={() => onDetail && onDetail(record)}>{value}</Button>
        },
        {
            key: 'owner',
            title: 'Agency',
            width: 200,
            dataIndex: 'owner',
            render: (value) => value?.name || "Admin",
        },
        {
            key: 'usage',
            title: 'Usage',
            width: 120,
            dataIndex: '_id',
            render: (value) => getUsage(value)
        },
        {
            key: 'discord',
            title: 'Discord Web Hook',
            dataIndex: 'discord'
        },
        {
            key: 'operation',
            title: 'Operation',
            width: 120,
            render: (_, record) => (
                <Flex gap="small">
                    <Tooltip title="Edit">
                        <Button
                            icon={<LuPenLine />}
                            onClick={() => onEdit && onEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<LuTrash />}
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
                        icon={<LuPlus />}
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
                            icon={<LuTrash />}
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
                dataSource={chatTeams}
            />
        </Card>
    )
};

export default ChatTeamTable;