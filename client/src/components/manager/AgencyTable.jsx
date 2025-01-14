import { AdminRole } from '@/utils/const'
import { Card, Table, Button, Flex, Switch, Avatar, Dropdown } from "antd";
import { DeleteOutlined, UserAddOutlined, EditOutlined, KeyOutlined, DatabaseOutlined } from "@ant-design/icons";

export const AgencyTable = ({ agencies, modelStats, accountStats, onDelete, onCreate, onEdit, onStatusChange, onPasswordReset, onUpdateDB }) => {
    const columns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/agency.png" /><span>{value}</span></Flex>
        },
        {
            key: 'role',
            title: 'Role',
            dataIndex: 'role',
            render: value => value == AdminRole.MANAGER ? "Manager" : "Agency"
        },
        {
            key: 'maxActors',
            title: 'Model Count / Limit',
            dataIndex: 'maxActors',
            render: (value, record) => {
                const modelInfos = modelStats.filter(item => item.creator == record._id);
                if (modelInfos.length > 0) {
                    return `${modelInfos[0].count} / ${value}`
                } else {
                    return `0 / ${value}`;
                }
            }
        },
        {
            key: 'maxAccounts',
            title: 'Account Count / Limit',
            dataIndex: 'maxAccounts',
            render: (value, record) => {
                const accountInfos = accountStats.filter(item => item.creator == record._id);
                if (accountInfos.length > 0) {
                    const count = accountInfos.reduce((sum, item) => sum + item.count, 0);
                    return `${count} / ${value}`
                } else {
                    return `0 / ${value}`;
                }
            }
        },
        {
            key: 'accountStats',
            title: 'Accounts',
            render: (value, record) => {
                const accountInfos = accountStats.filter(item => item.creator == record._id);
                if (accountInfos.length > 0) {
                    const str = accountInfos.map(item => `${item.platform} ${item.count}`).join(', ')
                    return `${str}`
                } else {
                    return ``;
                }
            }
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
                <Dropdown.Button
                    onClick={() => onEdit(record)}
                    menu={{
                        items: [
                            {
                                label: 'Reset Password',
                                key: 'password',
                                icon: <KeyOutlined />,
                            },
                            {
                                label: 'Delete Agency',
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                            },
                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "password":
                                    onPasswordReset(record)
                                    break;
                                case "delete":
                                    onDelete(record)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }}>
                    <EditOutlined /> Edit
                </Dropdown.Button>

                // <Flex gap="small">
                //     <Popconfirm
                //         title="Confirm"
                //         description="Are you sure to delete this agency?"
                //         okText="Yes"
                //         cancelText="No"
                //         onConfirm={() => onDelete(record)}
                //     >
                //         <Tooltip title="Delete agency">
                //             <Button icon={<DeleteOutlined />} danger />
                //         </Tooltip>
                //     </Popconfirm>
                //     <Tooltip title="Edit agency info">
                //         <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                //     </Tooltip>
                // </Flex >
            )
        },
    ]

    return (
        <Card
            title="Agency List"
            extra={[
                <Button key="create" icon={<UserAddOutlined />} onClick={onCreate}>Create</Button>,
                // <Button key="db" icon={<DatabaseOutlined />} onClick={onUpdateDB}>UpdateDB</Button>
            ]
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