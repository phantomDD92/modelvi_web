import { Card, Table, Tooltip, Popconfirm, Button, Flex, Image, Tag } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined, RollbackOutlined, EditOutlined } from "@ant-design/icons";
import { KnkyStoryType, Platform, SERVER_PATH, StoryType } from "@/utils/const";
import Media from "../common/Media";

export const ModelContentTable = ({ loading, model, onDelete, onCreate, onEdit, onBack, onClear, onSync }) => {

    const isFancentroStory = (record) => {
        return record.platforms && record.platforms.includes(Platform.FNC) && record.story != StoryType.NONE
    }

    const isKnkyStory = (record) => {
        return record.platforms && record.platforms.includes(Platform.KNKY) && record.knkyStoryType
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

    const getPlatformTag = (platform) => {
        switch (platform) {
            case Platform.F2F:
                return <Tag key={platform} color="processing">F2F</Tag>;
            case Platform.FNC:
                return <Tag key={platform} color="processing">Fancentro</Tag>;
            case Platform.FAN:
                return <Tag key={platform} color="processing">Fansly</Tag>;
            case Platform.FANVUE:
                return <Tag key={platform} color="processing">Fanvue</Tag>;
            case Platform.KNKY:
                return <Tag key={platform} color="processing">Knky</Tag>;
            case Platform.MALOUM:
                return <Tag key={platform} color="processing">Maloum</Tag>;
            default:
                break
        }
        return ""
    }

    const columns = [
        {
            key: 'platforms',
            title: 'Platforms',
            dataIndex: 'platforms',
            render: (value, record) =>
                <Flex gap="4px 0" wrap>
                    {value.filter(tag => tag != Platform.FNS).map(tag => getPlatformTag(tag))}
                    {isFancentroStory(record) && getFancentroStoryTag(record)}
                    {isKnkyStory(record) && getKnkyStoryTag(record)}
                </Flex>
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
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to delete this content?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record)}
                    >
                        <Tooltip title="Delete content">
                            <Button icon={<DeleteOutlined />} danger />
                        </Tooltip>
                    </Popconfirm>
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
                        onClick={onCreate}>
                        Create
                    </Button>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to clear all contents?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onClear}
                    >
                        <Button
                            key="clear"
                            icon={<DeleteOutlined />}
                            danger>
                            Clear
                        </Button>
                    </Popconfirm>
                    {
                        model && model.updated &&
                        <Button
                            key="sync"
                            icon={<UploadOutlined />}
                            onClick={onSync}>
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
            <Table
                pagination={{ position: ["topRight", "bottomRight"], showTotal: total => `Total ${total} contents`, showSizeChanger: true }}
                rowKey={row => row._id}
                loading={loading}
                dataSource={model ? model.contents : []}
                columns={columns}
            />
        </Card>
    )
};

export default ModelContentTable;