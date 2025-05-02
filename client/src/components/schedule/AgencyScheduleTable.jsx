import { F2FPostType, Platform, ScheduleStatus } from "@/utils/const";
import { getDateTime, getPlatformName } from "@/utils/string";
import { Button, Card, Flex, Radio, Table, Tag, Tooltip } from "antd";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import Media from "../common/Media";

const AgencyScheduleTable = ({
  loading,
  dataSource,
  pagination: {
    current,
    total,
    onChange,
  },
  filters: {
    platform,
    status,
    onPlatformChange,
    onStatusChange,
  },
  actions: {
    onCreate,
    onEdit,
    onDelete
  }
}) => {

  const getScheduleStatusTag = (value) => {
    switch (value) {
      case ScheduleStatus.WAITING:
        return <Tag color="warning">waiting</Tag>
      case ScheduleStatus.SCHEDULED:
        return <Tag color="processing">scheduled</Tag>
      case ScheduleStatus.FINISHED:
        return <Tag color="success">success</Tag>
      case ScheduleStatus.FAILED:
        return <Tag color="error">failed</Tag>
      default:
        break
    }
    return "-"
  }

  const getF2FPostType = (schedule) => {
    const { type, price, fanPrice } = schedule;
    switch (type) {
      case F2FPostType.PUBLIC:
        return <h4>Public</h4>;
      case F2FPostType.EXCLUSIVE_FOR_FANS:
        return <h4>Exclusive for fans</h4>;
      case F2FPostType.ONLY_NON_FANS_MUST_PAY:
        return <div><h4>Only non-fans must pay</h4><p>Followers: €{price}</p></div>;
      case F2FPostType.PAID_FOR_EVERYONE:
        return <div><h4>Paid for everyone</h4><p>Followers: €{price}, Fans: €{fanPrice}</p></div>;
      case F2FPostType.VIP_POST:
        return <div><h4>VIP post</h4><p>Fans: €{fanPrice}</p></div>;
      default:
        break;
    }
    return "-"
  }

  const getSchedulePostType = (schedule) => {
    switch (schedule.platform) {
      case Platform.F2F:
        return getF2FPostType(schedule)
      default:
        break;
    }
    return "-"
  }
  const columns = [
    {
      key: 'scheduledAt',
      title: 'Date/Time',
      dataIndex: 'scheduledAt',
      width: 120,
      render: value => getDateTime(value)
    },
    {
      key: 'account',
      title: 'Account',
      width: 150,
      dataIndex: 'account',
      render: (value, record) => value ? <div><p>{`${value.actor.number}. ${value.actor.name}`}</p><p>{`[${getPlatformName(record.platform)}] ${value.alias}`}</p></div> : '-'
    },
    {
      key: 'media',
      title: 'Media',
      dataIndex: 'image',
      width: 120,
      render: (value, record) => {
        if (record.media) {
          return <Media src={record.media.name} type={record.media.mode} width={100} small />
        } else if (record.image) {
          return <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
        }
      }
    },
    {
      key: 'preview',
      title: 'Preview',
      dataIndex: 'preview',
      width: 120,
      render: value => value && value.name ? <Media src={value.name} type={value.mode} width={100} small /> : '-'
    },
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      render: (value, record) => <div><h4>{value}</h4><p className="text-xs">{record.tags && record.tags.length > 0 ? record.tags.map(tag => `#${tag}`).join(" ") : "-"}</p></div>
    },
    {
      key: 'type',
      title: 'Type',
      width: 200,
      dataIndex: 'type',
      render: (value, record) => getSchedulePostType(record)
    },
    {
      key: 'folder',
      title: 'Folder',
      dataIndex: 'folder',
      width: 80,
      render: value => value || "-"
    },
    {
      key: 'status',
      title: 'Status',
      width: 80,
      dataIndex: 'status',
      render: value => getScheduleStatusTag(value)
    },
    {
      key: 'action',
      title: 'Action',
      width: 150,
      render: (_, record) => (
        <Flex gap="small">
          <Tooltip title="Edit content">
            <Button icon={<LuPencil />} onClick={() => onEdit && onEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete content">
            <Button icon={<LuTrash />} danger onClick={() => onDelete && onDelete(record)} />
          </Tooltip>
        </Flex>
      )
    },
  ];
  return (
    <Card
      title={
        <Flex align="center" gap={16}>
          <span className="mr-8">
            Scheduled Posts
          </span>
          <Radio.Group onChange={(e) => onPlatformChange && onPlatformChange(e.target.value)} value={platform}>
            <Radio.Button value={""}>All</Radio.Button>
            <Radio.Button value={Platform.F2F}>F2F</Radio.Button>
            <Radio.Button value={Platform.FNC} disabled>Fancentro</Radio.Button>
            <Radio.Button value={Platform.FAN} disabled>Fansly</Radio.Button>
            <Radio.Button value={Platform.KNKY} disabled>Knky</Radio.Button>
            <Radio.Button value={Platform.MALOUM} disabled>Maloum</Radio.Button>
          </Radio.Group>
          <Radio.Group onChange={(e) => onStatusChange && onStatusChange(e.target.value)} value={status}>
            <Radio.Button value={""}>All</Radio.Button>
            <Radio.Button value={`${ScheduleStatus.WAITING}`}>Waiting</Radio.Button>
            <Radio.Button value={`${ScheduleStatus.SCHEDULED}`}>Scheduled</Radio.Button>
            <Radio.Button value={`${ScheduleStatus.FINISHED}`}>Published</Radio.Button>
            <Radio.Button value={`${ScheduleStatus.FAILED}`}>Failed</Radio.Button>
          </Radio.Group>
        </Flex>}
      extra={
        <Flex gap="small">
          <Button
            icon={<LuPlus />}
            onClick={() => onCreate && onCreate()}>
            Create
          </Button>
        </Flex>
      }
    >
      <Table
        pagination={{
          current,
          total,
          onChange,
          position: ["topRight", "bottomRight"],
          showTotal: total => `Total ${total} posts`,
        }}
        loading={loading}
        rowKey={row => row._id}
        columns={columns}
        dataSource={dataSource}
      />
    </Card>
  )
}

export default AgencyScheduleTable;