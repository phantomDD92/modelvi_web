import {
    Button,
    Card,
    Flex,
    Image,
    Radio,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import {
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    F2FStoryType,
    KnkyStoryType,
    Platform,
    SERVER_PATH,
} from "@/utils/const";
import Media from "../common/Media";
import { getPlatformName } from "@/utils/string";
import { useState } from "react";
import { LuArrowUpLeftSquare, LuCornerDownLeft, LuImport, LuPencilLine, LuPlus, LuTrash, LuTrash2, LuUpload } from "react-icons/lu";
import { Link } from "react-router-dom";

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
        onImport,
        onBulkDelete,
        onBulkPlatform,
    }
}) => {
    const [mode, setMode] = useState("");

    // const isFancentroStory = (record) => {
    //     return record.platforms && record.platforms.includes(Platform.FNC) && (record.story && record.story != StoryType.NONE)
    // }

    // const getFancentroStoryTag = (record) => {
    //     switch (record.story) {
    //         case StoryType.PUBLIC:
    //             return <Tag color="error">FNC Story - Public</Tag>
    //         case StoryType.FOLLOWER:
    //             return <Tag color="error">FNC Story - Followers</Tag>
    //         case StoryType.SUBSCRIBER:
    //             return <Tag color="error">FNC Story - Subscribers</Tag>
    //         default:
    //             break;
    //     }
    //     return ""
    // }

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
            width: 250,
            render: (value, record) =>
                <Space direction="vertical" >
                    <Flex gap="4px 0" wrap>
                        {value.map(tag => getPlatformTag(tag))}
                    </Flex>
                    <Flex gap="4px 0" wrap>
                        {isF2FStory(record) ? getF2FStoryTag(record) : ""}
                        {/* {isFancentroStory(record) ? getFancentroStoryTag(record) : ""} */}
                        {isKnkyStory(record) ? getKnkyStoryTag(record) : ""}
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
            title: 'Title / Tags',
            dataIndex: 'title',
            render: (value, record) =>
                <div>
                    <h4>{value}</h4>
                    <p className="text-sm">{record.postTags && record.postTags.length > 0 ? record.postTags.map(tag => `#${tag}`).join(" ") : "-"}</p>
                </div>
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
                        <Button icon={<LuPencilLine />} onClick={() => onEdit && onEdit(record)} />
                    </Tooltip>

                    <Tooltip title="Delete content">
                        <Button icon={<LuTrash />} danger onClick={() => onDelete && onDelete(record)} />
                    </Tooltip>
                </Flex>
            )
        },
    ]

    const getFilteredSource = (contents) => {
        if (mode == "")
            return contents
        return contents.filter(content => content.mode == mode);
    }
    return (
        <Card
            title={
                <Space size="large">
                    <span>{model && model.name ? `${model.name}'s Content` : `Model's Content`}</span>
                    <Radio.Group onChange={(e) => setMode(e.target.value)} value={mode}>
                        <Radio.Button key="all" value="">All</Radio.Button>
                        <Radio.Button key="image" value="image">Image</Radio.Button>
                        <Radio.Button key="video" value="video">Video</Radio.Button>
                    </Radio.Group>
                </Space>
            }
            extra={
                <Flex gap="small">
                    {/* <Link to={`/import/${model?._id}`}>
                        <Button
                            key="import"
                            icon={<LuImport />}>
                            Import
                        </Button>
                    </Link> */}
                    <Button
                        key="create"
                        icon={<LuPlus />}
                        onClick={() => onCreate && onCreate()}>
                        Create
                    </Button>
                    <Button
                        key="clear"
                        icon={<LuTrash2 />}
                        onClick={() => onClear && onClear()}
                        danger>
                        Clear
                    </Button>
                    {
                        model && model.updated &&
                        <Button
                            key="sync"
                            icon={<LuUpload />}
                            onClick={() => onSync && onSync()}>
                            Sync
                        </Button>
                    }
                    <Button
                        key="return"
                        icon={<LuCornerDownLeft />}
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
                            icon={<LuPencilLine />}
                            onClick={() => onBulkPlatform && onBulkPlatform()}>
                            {`Change ${rowSelection.selectedRowKeys.length} contents' platform`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<LuTrash />}
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
                    pageSizeOptions: [100, 200, 500, 1000],
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} contents`,
                }}
                loading={loading}
                rowSelection={rowSelection} rowKey={row => row._id}
                dataSource={getFilteredSource(model?.contents || [])}
                columns={columns}
            />
        </Card>
    )
};

export default ModelContentTable;