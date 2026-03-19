import moment from "moment";
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Flex,
    Space,
    Table,
    Tag,
    Switch,
    Radio,
} from "antd";
import {
    Platform
} from "@/utils/const"
import { getPlatformName } from "@/utils/string";
import { StyledSearch } from "../common";
import { LuBook, LuPause, LuPencilLine, LuPlay, LuSettings2, LuTrash, LuTrash2, LuUserPlus } from "react-icons/lu";

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
        // {
        //     key: 'fee',
        //     title: 'Monthly Fee',
        //     dataIndex: 'fee',
        //     width: 200,
        //     render: (value, record) => moment().endOf("day").isBefore(moment(record.expiredAt)) ? getFiatAmount(value) : "-"
        // },
        // {
        //     key: 'expiredAt',
        //     title: 'Expiration',
        //     dataIndex: 'expiredAt',
        //     width: 120,
        //     render: value => value ? getDate(value) : "-"
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
            render: (_, record) => (
                <Dropdown.Button
                    onClick={() => onEdit && onEdit(record)}
                    menu={{
                        items: [
                            {
                                label: 'Edit Settings',
                                key: 'settings',
                                icon: <LuSettings2 />,
                            },
                            {
                                label: 'View History',
                                key: 'history',
                                icon: <LuBook />,
                            },
                            {
                                label: 'Delete Account',
                                key: 'delete',
                                icon: <LuTrash />,
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
                    <LuPencilLine /> Edit
                </Dropdown.Button>)

        },
    ]

    return (
        <Card
            title={<span className="mr-8"> Account List </span>
            }
            extra={
                <Flex gap="small">

                    <StyledSearch
                        defaultValue={search}
                        className="w-[200px]"
                        onSearch={value => onSearchChange && onSearchChange(value)}
                    />
                    <Button
                        icon={<LuUserPlus />}
                        onClick={() => onCreate && onCreate()}>
                        Create
                    </Button>
                </Flex>
            }
        >
            <Flex align="center" vertical gap="middle" className="w-full mb-8">
                <Radio.Group onChange={(e) => onPlatform && onPlatform(e.target.value)} value={platform}>
                    {[
                        Platform.F2F,
                        Platform.KNKY,
                        Platform.FNC,
                        Platform.FAN,
                        Platform.LOYALFANS,
                        Platform.MALOUM,
                        Platform.FANVUE,
                        Platform.FOURBASED,
                        Platform.MYMFANS,
                        Platform.ONLYFANS,
                        Platform.BESTFANS,
                        // Platform.FETLIFE,
                        // Platform.DFANXYZ,
                    ].map(element => <Radio.Button key={element} value={element}>{getPlatformName(element)}</Radio.Button>)}
                </Radio.Group>
                <Flex align="center" gap="middle" className="w-full">
                    {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
                        <>
                            <h3>Bulk Actions : </h3>
                            <Button
                                key="enable"
                                icon={<LuPlay />}
                                onClick={() => onBulkStatus && onBulkStatus(true)}>
                                {`Run ${rowSelection.selectedRowKeys.length} accounts`}
                            </Button>
                            <Button
                                key="disable"
                                icon={<LuPause />}
                                onClick={() => onBulkStatus && onBulkStatus(false)}>
                                {`Stop ${rowSelection.selectedRowKeys.length} accounts`}
                            </Button>
                            <Button
                                key="delete"
                                icon={<LuTrash2 />}
                                danger
                                onClick={() => onBulkDelete && onBulkDelete()}>
                                {`Delete ${rowSelection.selectedRowKeys.length} accounts`}
                            </Button>
                        </>
                    }
                </Flex>
            </Flex>
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