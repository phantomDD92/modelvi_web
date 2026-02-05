import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Flex,
    Space,
    Table,
    Tag,
} from "antd";
import { getPlatformName } from "@/utils/string";
import { StyledSearch } from "../common";
import { Link } from "react-router-dom";
import { LuBook, LuImport, LuPenLine, LuTrash, LuUpload, LuUserPlus } from "react-icons/lu";

export const AgencyModelTable = ({
    filters: {
        search,
        onSearchChange,
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
            title: 'Model',
            width: 300,
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
            key: 'accounts',
            title: 'Accounts',
            dataIndex: 'accounts',
            render: value => value.length == 0 ? '-' : <Flex gap="small">{value.map(el => getPlatformTag(el.platform))}</Flex>
        },
        {
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
            render: (_, record) => (
                <Dropdown.Button
                    onClick={() => onEdit(record)}
                    menu={{
                        items: [
                            {
                                label: 'View Contents',
                                key: 'content',
                                icon: <LuBook />,
                            },
                            record.updated &&
                            {
                                label: 'Sync Contents',
                                key: 'sync',
                                icon: <LuUpload />,
                            },
                            {
                                label: 'Delete Model',
                                key: 'delete',
                                icon: <LuTrash />,
                                danger: true,
                            },
                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "content":
                                    onContent(record)
                                    break;
                                case "sync":
                                    onSync(record)
                                    break;
                                case "delete":
                                    onDelete(record)
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
    ];

    return (
        <Card
            title={"Model List"}
            extra={
                <Flex gap={16}>
                    <StyledSearch defaultValue={search} onSearch={value => onSearchChange && onSearchChange(value)} />
                    <Button
                        icon={<LuUserPlus />}
                        onClick={onCreate}>
                        Create
                    </Button>
                    <Link to="/import">
                        <Button
                            icon={<LuImport />}>
                            Import Contents
                        </Button>
                    </Link>
                </Flex>
            }
        >
            <Space align='center' size="middle">
                {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
                    <>
                        <h3>Bulk Actions : </h3>
                        <Button
                            key="disable"
                            icon={<LuUpload />}
                            onClick={onBulkSync}>
                            {`Sync ${rowSelection.selectedRowKeys.length} models`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<LuTrash />}
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

export default AgencyModelTable;