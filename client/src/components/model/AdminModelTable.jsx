import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Flex,
    Input,
    Space,
    Table,
    Tag,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ReadOutlined,
    UserAddOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { getPlatformName } from "@/utils/string";
import { AgencySelect } from "../agency";
import { StyledSearch } from "../common";

export const AdminModelTable = ({
    filters: {
        search,
        onSearchChange,
        agency,
        agencyList,
        onAgencyChange,
    },
    pagination,
    rowSelection,
    loading,
    dataSource,
    actions: {
        onDelete,
        onCreate,
        onEdit,
        onBulkDelete,
        onBulkSync,
        onContent,
        onSync,
    }
}) => {
    const getPlatformTag = (platform) =>
        <Tag key={platform} color="processing">{getPlatformName(platform)}</Tag>;

    const columns = [
        {
            key: 'name',
            title: 'Name',
            width: 350,
            dataIndex: 'name',
            render: (value, record) => <Flex gap="middle" align='center'>
                <Avatar src="/img/actor.png" />
                <Space direction="vertical" size={1}>
                    <h5>{`[${record.owner?.name || "-"}]`}</h5>
                    <span>{`${record.number}. ${value}`}</span>
                </Space>
            </Flex>
        },
        {
            key: 'owner',
            title: 'Agency',
            width: 150,
            dataIndex: 'owner',
            render: value => value && value.name ? value.name : "-"
        },
        {
            key: 'accounts',
            title: 'Accounts',
            dataIndex: 'accounts',
            render: value => value.length == 0 ? '-' : <Flex gap="small">{value.map(el => getPlatformTag(el.platform))}</Flex>
        }, {
            key: 'contents',
            title: 'Contents',
            dataIndex: 'contentsLength',
            width: 150,
            render: value => value || "-"
        },
        {
            key: 'updated',
            title: 'Synced',
            dataIndex: 'updated',
            width: 100,
            render: value => value ? <Tag color="error">No</Tag> : <Tag color="success">Yes</Tag>
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) =>
                <Dropdown.Button
                    onClick={() => onEdit(record)}
                    menu={{
                        items: [
                            {
                                label: 'View Contents',
                                key: 'content',
                                icon: <ReadOutlined />,
                            },
                            record.updated &&
                            {
                                label: 'Sync Contents',
                                key: 'sync',
                                icon: <UploadOutlined />,
                            },
                            {
                                label: 'Delete Model',
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                            },
                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "content":
                                    onContent && onContent(record)
                                    break;
                                case "sync":
                                    onSync && onSync(record)
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

        },
    ];

    return (
        <Card
            title={"Model List"}
            extra={
                <Flex gap={16}>
                    <StyledSearch
                        defaultValue={search}
                        onSearch={value => onSearchChange && onSearchChange(value)}
                    />
                    <AgencySelect
                        all
                        value={agency}
                        dataSource={agencyList}
                        onChange={value => onAgencyChange && onAgencyChange(value)}
                    />
                    <Button
                        icon={<UserAddOutlined />}
                        onClick={onCreate}>
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
                            key="disable"
                            icon={<UploadOutlined />}
                            onClick={onBulkSync}>
                            {`Sync ${rowSelection.selectedRowKeys.length} models`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={onBulkDelete}>
                            {`Delete ${rowSelection.selectedRowKeys.length} models`}
                        </Button>
                    </>
                }
            </Space>
            <Table
                pagination={{
                    ...pagination,
                    pageSizeOptions: [10, 20, 50, 100],
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} models`,
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

export default AdminModelTable;