import {
  Button,
  Flex,
  Image,
  Space,
  Table,
  Tag,
} from "antd";
import {
  StoryType,
  Platform,
  SERVER_PATH,
} from "@/utils/const";
import Media from "../common/Media";
import { formatBytes, getPlatformName } from "@/utils/string";
import { LuTrash } from "react-icons/lu";

export const ImportContentTable = ({
  onDelete,
  dataSource,
}) => {

  const isKnkyStory = (record) => {
    return record.platforms && record.platforms.includes(Platform.KNKY) && (record.knkyStoryType && record.knkyStoryType != StoryType.NONE)
  }

  const getKnkyStoryTag = (record) => {
    switch (record.knkyStoryType) {
      case StoryType.PUBLIC:
        return <Tag color="error">Knky Story - Public</Tag>
      case StoryType.FOLLOWER:
        return <Tag color="error">Knky Story - Prime</Tag>
      case StoryType.SUBSCRIBER:
        return <Tag color="error">Knky Story - PayToView</Tag>
      default:
        break;
    }
    return ""
  }

  const isF2FStory = (record) => {
    return record.platforms && record.platforms.includes(Platform.F2F) && (record.f2fStoryType && record.f2fStoryType != StoryType.NONE)
  }

  const getF2FStoryTag = (record) => {
    switch (record.f2fStoryType) {
      case StoryType.PUBLIC:
        return <Tag color="error">F2F Story - Public</Tag>
      case StoryType.FOLLOWER:
        return <Tag color="error">F2F Story - Followers</Tag>
      case StoryType.SUBSCRIBER:
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
      width: 400,
      render: (value, record) =>
        <Space direction="vertical" >
          <Flex gap="4px 0" wrap>
            {value.map(tag => getPlatformTag(tag))}
          </Flex>
          <Flex gap="4px 0" wrap>
            {isF2FStory(record) ? getF2FStoryTag(record) : ""}
            {isKnkyStory(record) ? getKnkyStoryTag(record) : ""}
          </Flex>
        </Space>
    },
    {
      key: 'media',
      title: 'Media',
      dataIndex: 'media',
      width: 150,
      render: (value, record) => {
        if (record.media) {
          return <Media src={record.media.name} type={record.media.mode} width={100} small />
        } else if (record.image) {
          return <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
        }
      }
    },
    {
      key: 'size',
      title: 'Size',
      dataIndex: 'media',
      width: 100,
      render: (value, record) => formatBytes(record.media?.size)
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
        <Button icon={<LuTrash />} danger onClick={() => onDelete && onDelete(record)} />
      )
    },
  ]

  return (
    <Table
      // loading={loading}
      pagination={{
        showTotal: total => `Import ${total} contents`,
        pageSize: 100,
        position: ["topRight", "bottomRight"],
      }}
      dataSource={dataSource}
      columns={columns}
    />
  )
};

export default ImportContentTable;