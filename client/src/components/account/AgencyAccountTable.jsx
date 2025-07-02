import moment from "moment";
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
    Platform
} from "@/utils/const"
import { getDate, getFiatAmount, getPlatformName } from "@/utils/string";
import { StyledSearch } from "../common";

const AgencyAccountTable = ({
    pagination,
    rowSelection,
    dataSource,
    loading,
    platform,
    filters: {
        search,
        onSearchChange,
    },
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
    }
}) => {


    const columns = [
        {
            key: 'name',
            title: 'Name',
            width: 300,
            dataIndex: 'actor',
            render: (value, record) =>
                <Flex gap="middle" align='center'>
                    <Avatar src="/img/actor.png" />
                    <Space direction="vertical" size={1}>
                        <h5>{`[${record.owner?.name || "-"}]`}</h5>
                        <span>{`${record.number}. ${value.name}`}</span>
                    </Space>
                </Flex>
        },
        {
            key: 'alias',
            title: 'Alias',
            width: 200,
            dataIndex: 'alias',
            render: (value, record) =>
                <Space direction="vertical" size={1}>
                    <h5>{`[${getPlatformName(record.platform)}]`}</h5>
                    <span>{`${value}`}</span>
                </Space>
        },
        {
            key: 'chatTeam',
            title: 'Chat Team',
            dataIndex: 'chatTeam',
            width: 120,
            render: value => value?.name || "-"
        },
        {
            key: 'fee',
            title: 'Monthly Fee',
            dataIndex: 'fee',
            width: 200,
            render: value => getFiatAmount(value)
        },
        {
            key: 'expiredAt',
            title: 'Expiration',
            dataIndex: 'expiredAt',
            width: 120,
            render: value => value ? getDate(value) : "-"
        },
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
            render: (_, record) => (
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
                        <Radio.Button value={Platform.KNKY}>Knky</Radio.Button>
                        <Radio.Button value={Platform.MALOUM}>Maloum</Radio.Button>
                        <Radio.Button value={Platform.FANVUE}>Fanvue</Radio.Button>
                        <Radio.Button value={Platform.MYMFANS}>MymFans</Radio.Button>
                        <Radio.Button value={Platform.FOURBASED}>4Based</Radio.Button>
                        {/* <Radio.Button value={Platform.ONLYFANS}>OnlyFans</Radio.Button> */}
                    </Radio.Group>
                </Flex>
            }
            extra={
                <Flex gap="small">
                    <StyledSearch
                        defaultValue={search}
                        onSearch={value => onSearchChange && onSearchChange(value)}
                    />
                    <Button
                        icon={<UserAddOutlined />}
                        onClick={() => onCreate && onCreate()}>
                        Create
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
                            {`Enable ${rowSelection.selectedRowKeys.length} accounts`}
                        </Button>
                        <Button
                            key="disable"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => onBulkStatus && onBulkStatus(false)}>
                            {`Disable ${rowSelection.selectedRowKeys.length} accounts`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => onBulkDelete && onBulkDelete()}>
                            {`Delete ${rowSelection.selectedRowKeys.length} accounts`}
                        </Button>
                    </>
                }
            </Space>
            <Table
                pagination={{
                    ...pagination,
                    pageSizeOptions: [10, 20, 50, 100],
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} accounts`,
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

export default AgencyAccountTable