import { PostType, ScheduleStatus } from "@/utils/const";
import { getDateTime, getPlatformName } from "@/utils/string";
import { Button, Card, Flex, Select, Space, Table, Tooltip, Tag } from "antd";
import { LuDatabase, LuPencil, LuPlus, LuRefreshCcw, LuSend, LuTrash } from "react-icons/lu";
import Media from "../common/Media";

const AdminScheduleResultTable = ({
  loading,
  dataSource,
  pagination: {
    current,
    pageSize,
    total,
    onChange,
  },
  filters: {
    model,
    modelList,
    agency,
    agencyList,
    onModelChange,
    onAgencyChange,
    status,
    onStatusChange,
  },
  actions: {
    onCreate,
    onFix,
    onRetry,
    onDelete
  }
}) => {

  const getScheduleStatusTag = (value) => {
    switch (value) {
      case ScheduleStatus.WAITING:
        return <Tag>waiting</Tag>
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


  const getPostType = (schedule) => {
    switch (schedule.type) {
      case PostType.FREE:
        return <h4>Free</h4>;
      case PostType.FAN:
        return <h4>Fans</h4>;
      case PostType.PAID:
        return <div><h4>Paid (€{schedule.price})</h4></div>;
      default:
        break;
    }
    return "-"
  }
  const columns = [
    {
      key: 'scheduledAt',
      title: 'Date/Time',
      dataIndex: 'schedule',
      width: 120,
      render: value => getDateTime(value.scheduledAt)
    },
    {
      key: 'account',
      title: 'Model/Account',
      width: 200,
      dataIndex: 'account',
      render: (value, record) => <Space direction="vertical">
        <h5>{`[${record.owner?.name}] ${record.actor?.number}. ${record.actor?.name}`}</h5>
        <p>{`[${getPlatformName(value?.platform)}] ${value?.alias}`}</p>
      </Space>
    },
    {
      key: 'media',
      title: 'Media',
      dataIndex: 'schedule',
      width: 120,
      render: (value) => {
        if (value.media) {
          return <Media src={value.media.name} type={value.media.mode} width={100} small />
        } else if (value.image) {
          return <Image src={`${SERVER_PATH}/uploads/${value.image}`} width={100} />
        }
      }
    },
    {
      key: 'preview',
      title: 'Preview',
      dataIndex: 'schedule',
      width: 120,
      render: value => value.preview && value.preview?.name ? <Media src={value.preview.name} type={value.preview.mode} width={100} small /> : '-'
    },
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'schedule',
      render: (value) => <div><h4>{value.title}</h4><p className="text-xs">{value.tags && value.tags.length > 0 ? value.tags.map(tag => `#${tag}`).join(" ") : "-"}</p></div>
    },
    {
      key: 'type',
      title: 'Type',
      width: 120,
      dataIndex: 'schedule',
      render: (value) => getPostType(value)
    },
    {
      key: 'folder',
      title: 'Folder',
      dataIndex: 'schedule',
      width: 80,
      render: value => value.folder || "-"
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 80,
      render: value => getScheduleStatusTag(value)
    },
    {
      key: 'action',
      title: 'Action',
      width: 150,
      render: (_, record) => (
        <Flex gap="small">
          <Tooltip title="Delete content">
            <Button icon={<LuTrash />} danger onClick={() => onDelete && onDelete(record)} />
          </Tooltip>
          {record.status == ScheduleStatus.FAILED &&
            <Tooltip title="Retry posting">
              <Button icon={<LuRefreshCcw />} onClick={() => onRetry && onRetry(record)} />
            </Tooltip>
          }
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
          <Select
            className="min-w-[200px]"
            value={agency}
            onChange={value => onAgencyChange && onAgencyChange(value)}
            options={[{ value: "", label: "All Agencies" }].concat(agencyList
              .map(agency => ({ value: agency._id, label: `${agency.name}` })))
            }
          />
          <Select
            className="min-w-[250px]"
            value={model}
            onChange={value => onModelChange && onModelChange(value)}
            options={[{ value: "", label: "All Models" }].concat(modelList
              .filter(model => agency == "" || model.owner == agency)
              .map(model => ({ value: model._id, label: `[${model.number}] ${model.name}` })))
            }
          />
          <Select
            className="min-w-[150px]"
            value={status}
            onChange={value => onStatusChange && onStatusChange(value)}
            options={[
              { value: "", label: "All Status" },
              { value: `${ScheduleStatus.WAITING}`, label: "Waiting" },
              { value: `${ScheduleStatus.SCHEDULED}`, label: "Scheduled" },
              { value: `${ScheduleStatus.FINISHED}`, label: "Success" },
              { value: `${ScheduleStatus.FAILED}`, label: "Failed" },
            ]}
          />
        </Flex>}
      extra={
        <Flex gap="small">
          {/* <Button
            icon={<LuDatabase />}
            onClick={() => onFix && onFix()}>
            Fix Data
          </Button> */}
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
          pageSize,
          total,
          onChange,
          pageSizeOptions: [50, 100, 200, 500],
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

export default AdminScheduleResultTable;