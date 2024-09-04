import { AdminRole } from '@/utils/const'
import { Card, Table, Tooltip, Popconfirm, Button, Flex, Switch, Avatar } from "antd";
import { DeleteOutlined, UserAddOutlined, EditOutlined } from "@ant-design/icons";

export const AgencyTable = ({ agencies, onDelete, onCreate, onEdit, onStatusChange }) => {
    const columns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/agency.png" /><span>{value}</span></Flex>
        },
        {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
            render: value => value || "-"
        },
        {
            key: 'role',
            title: 'Role',
            dataIndex: 'role',
            render: value => value == AdminRole.MANAGER ? "Manager" : "Agency"
        },
        {
            key: 'maxActors',
            title: 'Model Limit',
            dataIndex: 'maxActors',
        },
        {
            key: 'maxAccounts',
            title: 'Account Limit',
            dataIndex: 'maxAccounts',
        },
        {
            key: 'status',
            title: 'Status',
            dataIndex: 'status',
            width: 200,
            render: (value, record) => (
                <Switch
                    checked={value}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                    onChange={(status) => onStatusChange(record, status)}
                />
            )
        },
        {
            key: 'action',
            title: 'Action',
            width: 200,
            render: (_, record) => (
                <Flex gap="small">
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to delete this agency?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record)}
                    >
                        <Tooltip title="Delete agency">
                            <Button icon={<DeleteOutlined />} danger />
                        </Tooltip>
                    </Popconfirm>
                    <Tooltip title="Edit agency info">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                </Flex>
            )
        },
    ]

    return (
        <Card
            title={
                <div className="h-20 p-6 text-xl">
                    Manager List
                </div>
            }
            extra={
                <Button icon={<UserAddOutlined />} onClick={onCreate}>Create</Button>
            }
        >
            <Table
                pagination={{ position: ["topRight", "bottomRight"], showTotal: total => `Total ${total} agencies` }}
                rowKey={row => row._id}
                dataSource={agencies}
                columns={columns}
            />
        </Card>
    )
};

export default AgencyTable;