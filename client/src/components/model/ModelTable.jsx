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
import {
    DeleteOutlined,
    EditOutlined,
    ReadOutlined,
    UserOutlined,
    UserAddOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { AdminRole } from "@/utils/const";
import { getPlatformName } from "@/utils/string";
import { useAuth } from "@/contexts";

export const ModelTable = ({
    pagination,
    rowSelection,
    loading,
    dataSource,
    actions: {
        onAgencyChange,
        onDelete,
        onCreate,
        onEdit,
        onBulkDelete,
        onBulkSync,
        onContent,
        onSync,
        // onProfile
    }
}) => {
    const { session } = useAuth();

    const hasPermission = (record) => {
        if (session?.role == AdminRole.MANAGER)
            return true
        if (record.owner && record.owner._id == session?.id)
            return true
        return false
    }
    const isAdmin = () => {
        return session?.role == AdminRole.MANAGER;
    }

    const getPlatformTag = (platform) =>
        <Tag key={platform} color="processing">{getPlatformName(platform)}</Tag>;

    const columns = [
        {
            key: 'number',
            title: 'No',
            dataIndex: 'number',
            width: 50,
        },
        {
            key: 'name',
            title: 'Name',
            width: 200,
            dataIndex: 'name',
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/actor.png" /><span>{value}</span></Flex>
        },
        {
            key: 'owner',
            title: 'Agency',
            width: 150,
            dataIndex: 'owner',
            render: value => value && value.name ? value.name : "-"
        },
        {
            key: 'age',
            title: 'Age',
            width: 100,
            dataIndex: 'birthday',
            render: value => moment().diff(moment(value), 'year', false) || '-'
        },
        {
            key: 'birthplace',
            title: 'Birth Place',
            width: 200,
            dataIndex: 'birthplace'
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
            key: 'accounts',
            title: 'Accounts',
            dataIndex: 'accounts',
            render: value => value.length == 0 ? '-' : <Flex gap="small">{value.map(el => getPlatformTag(el.platform))}</Flex>
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) => hasPermission(record) ? (
                <Dropdown.Button
                    onClick={() => onEdit(record)}
                    menu={{
                        items: isAdmin() ?
                            [
                                {
                                    label: 'View Contents',
                                    key: 'content',
                                    icon: <ReadOutlined />,
                                },
                                {
                                    label: 'Change Agency',
                                    key: 'agency',
                                    icon: <UserOutlined />,
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
                            ] :
                            [
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
                                    onContent(record)
                                    break;
                                // case "profile":
                                //     onProfile(record)
                                //     break;
                                case "sync":
                                    onSync(record)
                                    break;
                                case "delete":
                                    onDelete(record)
                                    break;
                                case "agency":
                                    onAgencyChange(record)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }}>
                    <EditOutlined /> Edit
                </Dropdown.Button>
            ) : ""
        },
    ];

    return (
        <Card
            title={"Model List"}
            extra={
                <Button
                    icon={<UserAddOutlined />}
                    onClick={onCreate}>
                    Create
                </Button>
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

export default ModelTable;