import { AdminRole } from '@/utils/const'
import { Card, Table, Button, Flex, Switch, Avatar, Dropdown, Space, Typography } from "antd";
import { DeleteOutlined, UserAddOutlined, EditOutlined, KeyOutlined, DatabaseOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { LuGlobe, LuTrash, LuUser, LuWallet } from 'react-icons/lu';
import { getFiatAmount } from '@/utils/string';

export const AgencyTable = ({
    pagination,
    rowSelection,
    dataSource,
    loading,
    actions: {
        onBulkStatus,
        onBulkDelete,
        onDelete,
        onStatusChange,
        onBalance,
        onPricePlans,
        onReferrer,
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
            key: 'referrer',
            title: 'Referrer',
            width: 120,
            dataIndex: 'referrer',
            render: value => value?.name || "-"
        },
        {
            key: 'balance',
            title: 'Balance',
            dataIndex: 'balance',
            render: value => getFiatAmount(value)
        },
        {
            key: 'monthlyFee',
            title: 'Monthly Fee',
            dataIndex: 'monthlyFee',
            render: value => value || 0,
        },
        {
            key: 'modelCount',
            title: 'Models',
            dataIndex: 'modelCount',
            render: value => value || 0
        },
        {
            key: 'accountCount',
            title: 'Accounts',
            dataIndex: 'accountCount',
            render: value => value || "-"
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
                    onChange={(status) => onStatusChange && onStatusChange(record, status)}
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
                                label: 'Change Price Plans',
                                key: 'plan',
                                icon: <LuGlobe />,
                            },
                            {
                                label: 'Change Referrer',
                                key: 'referrer',
                                icon: <LuUser />,
                            },
                            {
                                label: 'Delete Agency',
                                key: 'delete',
                                icon: <LuTrash />,
                                danger: true,
                            },
                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "balance":
                                    onBalance && onBalance(record)
                                    break;
                                case "plan":
                                    onPricePlans && onPricePlans(record)
                                    break;
                                case "referrer":
                                    onReferrer && onReferrer(record)
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
            // extra={[
            //     <Button key="create" icon={<UserAddOutlined />} onClick={() => onCreate && onCreate()}>Create</Button>,
            //     // <Button key="db" icon={<DatabaseOutlined />} onClick={() => onUpdateDB && onUpdateDB()}>UpdateDB</Button>
            // ]}
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