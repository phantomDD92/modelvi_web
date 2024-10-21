import { Card, Table, Tooltip, Popconfirm, Button, Flex, Switch, Radio, Tag, Avatar, Dropdown } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, ReadOutlined, SolutionOutlined } from "@ant-design/icons";
import { AdminRole, Platform } from "@/utils/const"
import moment from "moment";

const AccountTable = ({ auth, accounts, accountsCount, page, platform, onPageChange, onStatusChange, onPlatformChange, onCreate, onStartAll, onStopAll, onEdit, onDelete, onParameter, onHistory }) => {
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
            width: 150,
            dataIndex: 'alias',
        },
        {
            key: 'email',
            title: 'Email',
            width: 150,
            dataIndex: 'email',
        },
        {
            key: 'password',
            title: 'Password',
            dataIndex: 'password',
            width: 150,
            render: value => value.substr(0, 2) + "***" + value.substr(value.length - 2, 2)
        },
        {
            key: 'bot',
            title: 'Bot',
            dataIndex: 'updatedAt',
            width: 150,
            render: value => value ? moment().diff(moment(value), 'minute', false) < 10 ? <Tag color="success">Running</Tag> : <Tag color="error">Closed</Tag> : <Tag color="error">Closed</Tag>
        },
        {
            key: 'lastError',
            title: 'LastError',
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
                    onChange={(status) => onStatusChange(record, status)}
                />
            )
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) => hasPermission(auth, record) ? (
                <Dropdown.Button
                onClick={() => onEdit(record)}
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
                                onParameter(record)
                                break;
                            case "history":
                                onHistory(record)
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
            </Dropdown.Button>)
            :""
        },
    ]

    return (
        <Card
            title={
                <Flex align="center">
                    <div className="h-20 p-6 text-xl">
                        Account List
                    </div>
                    <Radio.Group onChange={(e) => onPlatformChange(e.target.value)} value={platform}>
                        <Radio.Button value={Platform.F2F}>F2F</Radio.Button>
                        <Radio.Button value={Platform.FNC}>Fancentro</Radio.Button>
                        <Radio.Button value={Platform.FAN}>Fansly</Radio.Button>
                    </Radio.Group>
                </Flex>
            }
            extra={
                <Flex gap="small">
                    <Button
                        icon={<UserAddOutlined />}
                        onClick={onCreate}>
                        Create
                    </Button>
                    <Button
                        onClick={onStartAll}>
                        Start All
                    </Button>
                    <Button
                        onClick={onStopAll}>
                        Stop All
                    </Button>
                </Flex>
            }
        >
            <Table
                pagination={{
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} accounts`,
                    current: page,
                    total: accountsCount,
                    onChange: onPageChange,
                }}
                rowKey={row => row._id}
                dataSource={accounts}
                columns={columns}
            />
        </Card>
    );
}

export default AccountTable