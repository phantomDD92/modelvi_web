import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Flex,
    Radio,
    Space,
    Table,
    Tag,
    Switch,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    UserAddOutlined,
    ReadOutlined,
    SolutionOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
    AdminRole,
    Platform
} from "@/utils/const"
import moment from "moment";

const AccountTable = ({
    pagination,
    rowSelection,
    dataSource,
    auth,
    loading,
    platform,
    actions: {
        onStatus,
        onPlatform,
        onCreate,
        onEdit,
        onDelete,
        onSetting,
        onHistory,
        onBulkStatus,
        onBulkDelete,
        onAllStatus,
    }
}) => {
    const hasPermission = (auth, record) => {
        if (auth.role == AdminRole.MANAGER)
            return true
        if (record.owner && record.owner._id == auth._id)
            return true
        return false
    }
    const columns = [
        {
            key: 'number',
            title: 'No.',
            dataIndex: 'number',
            width: 50,
        },
        {
            key: 'name',
            title: 'Name',
            width: 150,
            dataIndex: 'actor',
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/actor.png" /><span>{value.name}</span></Flex>
        },
        {
            key: 'owner',
            title: 'Agency',
            width: 120,
            dataIndex: 'owner',
            render: value => value && value.name ? value.name : "-"
        },
        {
            key: 'alias',
            title: 'Alias',
            width: 120,
            dataIndex: 'alias',
        },
        {
            key: 'email',
            title: 'Email',
            width: 150,
            dataIndex: 'email',
        },
        {
            key: 'chatTeam',
            title: 'Chat Team',
            dataIndex: 'chatTeam',
            width: 120,
            render: value => value?.name || "-"
        },
        // {
        //     key: 'password',
        //     title: 'Password',
        //     dataIndex: 'password',
        //     width: 100,
        //     render: value => value.substr(0, 2) + "***" + value.substr(value.length - 2, 2)
        // },
        {
            key: 'bot',
            title: 'Bot',
            dataIndex: 'updatedAt',
            width: 250,
            render: (value, record) => {
                if (value && moment().diff(moment(value), 'minute', false) < 10) {
                    const ops = ["posting"]
                    if (record.params?.storyEnabled)
                        ops.push("story's")
                    if (record.params?.commentEnabled)
                        ops.push("commenting")
                    return <>{ops.map(item => <Tag color="success" key={`${record.alias}_${item}`}>{item}</Tag>)}</>
                }
                return <Tag color="error">Closed</Tag>
            }
        },
        {
            key: 'lastError',
            title: 'LastError',
            width: 250,
            dataIndex: 'lastError',
        },
        {
            key: 'status',
            title: 'Status',
            dataIndex: 'status',
            width: 120,
            render: (value, record) => (
                <Switch
                    checked={value}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                    onChange={(status) => onStatus && onStatus(record, status)}
                />
            )
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) => hasPermission(auth, record) ? (
                <Dropdown.Button
                    onClick={() => onEdit && onEdit(record)}
                    menu={{
                        items: [
                            {
                                label: 'Edit Settings',
                                key: 'settings',
                                icon: <SolutionOutlined />,
                            },
                            {
                                label: 'View History',
                                key: 'history',
                                icon: <ReadOutlined />,
                            },
                            {
                                label: 'Delete Account',
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                            },
                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "settings":
                                    onSetting && onSetting(record)
                                    break;
                                case "history":
                                    onHistory && onHistory(record)
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
                </Dropdown.Button>)
                : ""
        },
    ]

    return (
        <Card
            title={
                <Flex align="center">
                    <span className="mr-8">
                        Account List
                    </span>
                    <Radio.Group onChange={(e) => onPlatform && onPlatform(e.target.value)} value={platform}>
                        <Radio.Button value={Platform.F2F}>F2F</Radio.Button>
                        <Radio.Button value={Platform.FNC}>Fancentro</Radio.Button>
                        <Radio.Button value={Platform.FAN}>Fansly</Radio.Button>
                        <Radio.Button value={Platform.FANVUE}>Fanvue</Radio.Button>
                        <Radio.Button value={Platform.KNKY}>Knky</Radio.Button>
                        <Radio.Button value={Platform.MALOUM}>Maloum</Radio.Button>
                    </Radio.Group>
                </Flex>
            }
            extra={
                <Flex gap="small">
                    <Button
                        icon={<UserAddOutlined />}
                        onClick={() => onCreate && onCreate()}>
                        Create
                    </Button>
                    <Button
                        onClick={() => onAllStatus && onAllStatus(true)}>
                        Enable All
                    </Button>
                    <Button
                        onClick={() => onAllStatus && onAllStatus(false)}>
                        Disable All
                    </Button>
                </Flex>
            }
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
                            onClick={() => onBulkDelete && onBulkDelete()}>
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
                rowSelection={rowSelection}
                loading={loading}
                rowKey={row => row._id}
                dataSource={dataSource}
                columns={columns}
            />
        </Card>
    );
}

export default AccountTable