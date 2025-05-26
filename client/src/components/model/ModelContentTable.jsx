import {
    Button,
    Card,
    Flex,
    Image,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    RollbackOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    F2FStoryType,
    KnkyStoryType,
    Platform,
    SERVER_PATH,
    StoryType
} from "@/utils/const";
import Media from "../common/Media";
import { getPlatformName } from "@/utils/string";

export const ModelContentTable = ({
    pagination,
    rowSelection,
    loading,
    // dataSource,
    model,
    actions: {
        onDelete,
        onCreate,
        onEdit,
        onBack,
        onClear,
        onSync,
        onBulkDelete,
        onBulkPlatform,
    }
}) => {

    const isFancentroStory = (record) => {
        return record.platforms && record.platforms.includes(Platform.FNC) && (record.story && record.story != StoryType.NONE)
    }

    const getFancentroStoryTag = (record) => {
        switch (record.story) {
            case StoryType.PUBLIC:
                return <Tag color="error">FNC Story - Public</Tag>
            case StoryType.FOLLOWER:
                return <Tag color="error">FNC Story - Followers</Tag>
            case StoryType.SUBSCRIBER:
                return <Tag color="error">FNC Story - Subscribers</Tag>
            default:
                break;
        }
        return ""
    }

    const isKnkyStory = (record) => {
        return record.platforms && record.platforms.includes(Platform.KNKY) && (record.knkyStoryType && record.knkyStoryType != KnkyStoryType.NONE)
    }

    const getKnkyStoryTag = (record) => {
        switch (record.knkyStoryType) {
            case KnkyStoryType.PUBLIC:
                return <Tag color="error">Knky Story - Public</Tag>
            case KnkyStoryType.PRIME:
                return <Tag color="error">Knky Story - Prime</Tag>
            case KnkyStoryType.PAYTOVIEW:
                return <Tag color="error">Knky Story - PayToView</Tag>
            default:
                break;
        }
        return ""
    }

    const isF2FStory = (record) => {
        return record.platforms && record.platforms.includes(Platform.F2F) && (record.f2fStoryType && record.f2fStoryType != F2FStoryType.NONE)
    }

    const getF2FStoryTag = (record) => {
        switch (record.f2fStoryType) {
            case F2FStoryType.PUBLIC:
                return <Tag color="error">F2F Story - Public</Tag>
            case F2FStoryType.FOLLOWERS:
                return <Tag color="error">F2F Story - Followers</Tag>
            case F2FStoryType.FANS:
                return <Tag color="error">F2F Story - Fans</Tag>
            default:
                break;
        }
        return ""
    }

    const getPlatformTag = (platform) => <Tag key={platform} color="processing">{getPlatformName(platform)}</Tag>;

    const columns = [
        {
            key: 'platforms',
            title: 'Platforms',
            dataIndex: 'platforms',
            render: (value, record) =>
                <Space direction="vertical" >
                    <Flex gap="4px 0" wrap>
                        {value.map(tag => getPlatformTag(tag))}
                    </Flex>
                    <Flex gap="4px 0" wrap>
                        {isF2FStory(record) ? getF2FStoryTag(record): ""}
                        {isFancentroStory(record) ? getFancentroStoryTag(record): ""}
                        {isKnkyStory(record) ? getKnkyStoryTag(record): ""}
                    </Flex>
                </Space>

        },
        {
            key: 'media',
            title: 'Media',
            dataIndex: 'image',
            width: 150,
            render: (value, record) => {
                if (record.media && record.media.length > 0) {
                    return <Media src={record.media[0].name} type={record.media[0].mode} width={100} small />
                } else if (record.image) {
                    return <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
                }
            }
        },
        {
            key: 'preview',
            title: 'Preview',
            dataIndex: 'preview',
            width: 150,
            render: value => value && value.name ? <Media src={value.name} type={value.mode} width={100} small /> : '-'
        },
        {
            key: 'title',
            title: 'Title',
            width: 450,
            dataIndex: 'title',
        },
        {
            key: 'tags',
            title: 'Tags',
            width: 200,
            dataIndex: 'tags',
            render: (value, record) => record.postTags && record.postTags.length > 0 ? record.postTags.map(tag => `#${tag}`).join(" ") : (record.tags || "-")
        },
        {
            key: 'folder',
            title: 'Folder',
            dataIndex: 'folder',
            width: 80,
            render: value => value || "-"
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) => (
                <Flex gap="small">
                    <Tooltip title="Edit content">
                        <Button icon={<EditOutlined />} onClick={() => onEdit && onEdit(record)} />
                    </Tooltip>

                    <Tooltip title="Delete content">
                        <Button icon={<DeleteOutlined />} danger onClick={() => onDelete && onDelete(record)} />
                    </Tooltip>
                </Flex>
            )
        },
    ]

    return (
        <Card
            title={model && model.name ? `${model.name}'s Content` : `Model's Content`}
            extra={
                <Flex gap="small">
                    <Button
                        key="create"
                        icon={<PlusOutlined />}
                        onClick={() => onCreate && onCreate()}>
                        Create
                    </Button>
                    <Button
                        key="clear"
                        icon={<DeleteOutlined />}
                        onClick={() => onClear && onClear()}
                        danger>
                        Clear
                    </Button>
                    {
                        model && model.updated &&
                        <Button
                            key="sync"
                            icon={<UploadOutlined />}
                            onClick={() => onSync && onSync()}>
                            Sync
                        </Button>
                    }
                    <Button
                        key="return"
                        icon={<RollbackOutlined />}
                        onClick={onBack}>
                        Return
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
                            onClick={() => onBulkPlatform && onBulkPlatform()}>
                            {`Change ${rowSelection.selectedRowKeys.length} contents' platform`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => onBulkDelete && onBulkDelete()}>
                            {`Delete ${rowSelection.selectedRowKeys.length} contents`}
                        </Button>
                    </>
                }
            </Space>
            <Table
                pagination={{
                    ...pagination,
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} contents`,
                }}
                loading={loading}
                rowSelection={rowSelection} rowKey={row => row._id}
                dataSource={model?.contents || []}
                columns={columns}
            />
        </Card>
    )
};

export default ModelContentTable;