import { Platform, PostType, ScheduleStatus } from "@/utils/const";
import { formatBytes, getDateTime, getPlatformName } from "@/utils/string";
import { Button, Card, Flex, Select, Table, Tooltip, Tag, Carousel } from "antd";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import Media from "../common/Media";

const AdminScheduleResultTable = ({
  limited,
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
    platform,
    onPlatformChange,
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
      case ScheduleStatus.EXPIRED:
        return <Tag color="warning">expired</Tag>
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
      dataIndex: 'scheduledAt',
      width: 120,
      render: value => getDateTime(value)
    },
    {
      key: 'account',
      title: 'Model / Account',
      width: 350,
      dataIndex: 'account',
      render: (value, record) =>
        <div>
          <div class="flex gap-2 text-blue-500"><h5>{`[${record.owner?.name || "-"}]`}</h5><h5>{`${record.actor?.number || "-"}. ${record.actor?.name || "-"}`}</h5></div>
          <div class="flex gap-2"><h5 className="text-red-500">{`[${getPlatformName(value?.platform) || "-"}]`}</h5><h5>{`${value?.alias || "-"}`}</h5></div>
        </div>
    },
    {
      key: 'media',
      title: 'Media',
      dataIndex: 'schedule',
      width: 120,
      render: (value) => limited
        ? value.medias.length
        : <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000} className="w-[150px]">
          {value.medias.map(media => <Media src={media.name} type={media.mode} width={100} small />)}
        </Carousel>
    },
    {
      key: 'size',
      title: 'Size',
      dataIndex: 'schedule',
      width: 120,
      render: (value) => value.medias.map(media => <p>{formatBytes(media.size)}</p>)
    },
    {
      key: 'title',
      title: 'Title / Tags',
      dataIndex: 'schedule',
      render: (value) =>
        limited
          ? "*".repeat(value.title.length)
          : <div>
            <h4>{value.title}</h4>
            <p className="text-xs">{value.tags && value.tags.length > 0 ? value.tags.map(tag => `#${tag}`).join(" ") : "-"}</p>
          </div>
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
            <Button icon={<Trash />} danger onClick={() => onDelete && onDelete(record)} />
          </Tooltip>
          {record.status >= ScheduleStatus.FAILED &&
            <Tooltip title="Retry posting">
              <Button icon={<RefreshCcw />} onClick={() => onRetry && onRetry(record)} />
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
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
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
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            className="min-w-[250px]"
            value={platform}
            onChange={value => onPlatformChange && onPlatformChange(value)}
            options={[{ value: "", label: "All Platforms" }].concat(
              [Platform.F2F,
              Platform.KNKY,
              Platform.FNC,
              Platform.FAN,
              Platform.LOYALFANS,
              Platform.MALOUM,
              Platform.FANVUE,
              Platform.FOURBASED,
              Platform.MYMFANS,
              Platform.FETLIFE,
              Platform.ONLYFANS,]
                .map(platform => ({ value: platform, label: getPlatformName(platform) })))
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
              { value: `${ScheduleStatus.EXPIRED}`, label: "Expired" },
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
            icon={<Plus />}
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