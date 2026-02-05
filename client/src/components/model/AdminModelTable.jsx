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
import { getFiatAmount, getPlatformName } from "@/utils/string";
import { AgencySelect } from "../agency";
import { StyledSearch } from "../common";
import { Platform } from "@/utils/const";
import { LuBook, LuPencilLine, LuTrash, LuUpload, LuUserPlus } from "react-icons/lu";

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
    dataSource: {models, modelsStat},
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

    // Sort accounts by platform order defined in Platform const
    const sortAccountsByPlatform = (accounts) => {
        // Create an array of platform values in order
        const platformOrder = Object.values(Platform);
        
        return [...accounts].sort((a, b) => {
            const indexA = platformOrder.indexOf(a.platform);
            const indexB = platformOrder.indexOf(b.platform);
            
            // If platform not found in order, put it at the end
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            
            return indexA - indexB;
        });
    };

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
            title: 'Platform',
            dataIndex: 'accounts',
            render: value => {
                if (value.length == 0) return '-';
                const sortedAccounts = sortAccountsByPlatform(value);
                return <Flex gap="small">{sortedAccounts.map(el => getPlatformTag(el.platform))}</Flex>;
            }
        },
        {
            key: 'revenue',
            title: 'Revenue',
            dataIndex: '_id',
            width: 150,
            render: value => getFiatAmount(modelsStat.find(stat => stat._id == value)?.revenue || 0)
        },
        // {
        //     key: 'fee',
        //     title: 'Monthly Fee',
        //     dataIndex: '_id',
        //     width: 100,
        //     render: value => getFiatAmount(modelsStat.find(stat => stat._id == value)?.fee || 0)
        // },
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
            render: (_, record) =>
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
                    <LuPencilLine /> Edit
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
                        icon={<LuUserPlus />}
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
                dataSource={models}
                columns={columns}
            />
        </Card>
    )
};

export default AdminModelTable;