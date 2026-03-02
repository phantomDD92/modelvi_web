import { PricePlanMode } from '@/utils/const'
import { Card, Table, Button, Flex, Switch, Avatar, Dropdown, Space, Radio } from "antd";
import { closeDueDate, getBalanceAmount, getDueDate, getFiatAmount } from '@/utils/string';
import { LuDatabase, LuEye, LuEyeOff, LuGlobe, LuPenLine, LuTrash, LuUser, LuUserPlus, LuWallet, LuWalletCards } from 'react-icons/lu';

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
        onPricePlanMode,
        onDueDate,
    },
}) => {
    const columns = [
        {
            key: 'name',
            title: 'Name, Email, Telegram',
            dataIndex: 'name',
            width: 250,
            render: (value, record) =>
                <Flex gap="middle" align='center'>
                    <Avatar src="/img/agency.png" />
                    <Space direction="vertical" size={0}>
                        <h4>{value}</h4>
                        <span>{record.email || "-"}</span>
                        <span>{record.telegram ? record.telegram[0] == "@" ? record.telegram : "@" + record.telegram : "-"}</span>
                    </Space>
                </Flex>
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
            width: 150,
            dataIndex: 'balance',
            render: value => <h5>{getBalanceAmount(value)}</h5>
        },
        {
            key: 'monthlyFee',
            title: 'Monthly Fee',
            dataIndex: 'fee',
            width: 150,
            render: (value, record) => value > 0 ?
                <Space direction="vertical" size={1}>
                    <h5>{getFiatAmount(value)}</h5>
                    <span>{`+ ${getFiatAmount(record.proxyFee || 0)} (Proxy)`}</span>
                    {closeDueDate(record.dueDate) ? <span className='text-red-500'>{`( ${getDueDate(record.dueDate)} )`}</span> : <span className='text-green-500'>{`( ${getDueDate(record.dueDate)} )`}</span>}
                </Space>
                : "-"
        },
        {
            key: 'pricePlan',
            title: 'Price Plan',
            dataIndex: 'pricePlanMode',
            width: 150,
            render: (value, record) => (
                <Radio.Group onChange={(e) => onPricePlanMode && onPricePlanMode(record, e.target.value)} value={value} buttonStyle='solid'>
                    <Radio.Button value={PricePlanMode.PER_MODEL}>Per Model</Radio.Button>
                    <Radio.Button value={PricePlanMode.PER_ACCOUNT}>Per Account</Radio.Button>
                </Radio.Group>
            )
        },
        {
            key: 'accountCount',
            title: 'Models / Accounts',
            dataIndex: 'accountCount',
            render: (value, record) => <Space direction="vertical" size={0}>
                <span>{`${record.modelCount} Models` || "-"}</span>
                <span>{value || "-"}</span>
            </Space>
        },
        {
            key: 'status',
            title: 'Status',
            dataIndex: 'status',
            width: 150,
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
            width: 150,
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
                                label: 'Change Due Date',
                                key: 'duedate',
                                icon: <LuWalletCards />,
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
                                case "duedate":
                                    onDueDate && onDueDate(record)
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
                    <LuPenLine /> Edit
                </Dropdown.Button>
            )
        },
    ]

    return (
        <Card
            title="Agency List"
        // extra={[
        //     <Button key="create" icon={<LuUserPlus />} onClick={() => onCreate && onCreate()}>Create</Button>,
        //     <Button key="db" icon={<LuDatabase />} onClick={() => onUpdateDB && onUpdateDB()}>UpdateDB</Button>
        // ]}
        >
            <Space align='center' size="middle">
                {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
                    <>
                        <h3>Bulk Actions : </h3>
                        <Button
                            key="enable"
                            icon={<LuEye />}
                            onClick={() => onBulkStatus && onBulkStatus(true)}>
                            {`Enable ${rowSelection.selectedRowKeys.length} agencies`}
                        </Button>
                        <Button
                            key="disable"
                            icon={<LuEyeOff />}
                            onClick={() => onBulkStatus && onBulkStatus(false)}>
                            {`Disable ${rowSelection.selectedRowKeys.length} agencies`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<LuTrash />}
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