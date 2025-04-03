import { AdminRole } from '@/utils/const'
import { Card, Table, Button, Flex, Switch, Avatar, Dropdown, Space, Typography } from "antd";
import { DeleteOutlined, UserAddOutlined, EditOutlined, KeyOutlined, DatabaseOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { LuGlobe, LuWallet } from 'react-icons/lu';

export const AgencyTable = ({
    pagination,
    rowSelection,
    dataSource,
    modelStats,
    feeStats,
    accountStats,
    loading,
    actions: {
        onBulkStatus,
        onBulkDelete,
        onDelete,
        onCreate,
        onEdit,
        onStatusChange,
        onPasswordReset,
        onBalance,
        onVIP,
        onUpdateDB,
    },
}) => {
    const columns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: 150,
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/agency.png" /><span>{value}</span></Flex>
        },
        {
            key: 'role',
            title: 'Role',
            dataIndex: 'role',
            width: 120,
            render: (value, record) => value == AdminRole.MANAGER ? "Manager" : record.vip ? "VIP Agency" : "Agency"
        },
        {
            key: 'email',
            title: 'Email',
            width: 150,
            dataIndex: 'email',
        },
        {
            key: 'telegram',
            title: 'Telegram',
            width: 120,
            dataIndex: 'telegram',
        },
        {
            key: 'balance',
            title: 'Balance',
            dataIndex: 'balance',
            render: value => value || 0
        },
        {
            key: 'feeStats',
            title: 'Monthly Fee',
            render: (value, record) => {
                const feeInfo = feeStats.find(item => item._id == record._id);
                if (feeInfo) {
                    return `${feeInfo.monthlyFee}`
                } else {
                    return ``;
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
                                label: 'Add Balance',
                                key: 'balance',
                                icon: <LuWallet />,
                            },
                            {
                                label: record.vip ? 'Disable VIP' : 'Enable VIP',
                                key: 'vip',
                                icon: <LuGlobe />,
                            },
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
                                    onPasswordReset && onPasswordReset(record)
                                    break;
                                case "balance":
                                    onBalance && onBalance(record)
                                    break;
                                case "vip":
                                    onVIP && onVIP(record, record.vip != true)
                                    break;
                                case "delete":
                                    onDelete && onDelete(record)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }}>
                    <EditOutlined /> Edit
                </Dropdown.Button>
            )
        },
    ]

    return (
        <Card
            title="Agency List"
            extra={[
                <Button key="create" icon={<UserAddOutlined />} onClick={() => onCreate && onCreate()}>Create</Button>,
                // <Button key="db" icon={<DatabaseOutlined />} onClick={() => onUpdateDB && onUpdateDB()}>UpdateDB</Button>
            ]}
        >
            <Space align='center' size="middle">
                {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
                    <>
                        <h3>Bulk Actions : </h3>
                        <Button
                            key="enable"
                            icon={<EyeOutlined />}
                            onClick={() => onBulkStatus && onBulkStatus(true)}>
                            {`Enable ${rowSelection.selectedRowKeys.length} agencies`}
                        </Button>
                        <Button
                            key="disable"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => onBulkStatus && onBulkStatus(false)}>
                            {`Disable ${rowSelection.selectedRowKeys.length} agencies`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={onBulkDelete}>
                            {`Delete ${rowSelection.selectedRowKeys.length} agencies`}
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

export default AgencyTable;