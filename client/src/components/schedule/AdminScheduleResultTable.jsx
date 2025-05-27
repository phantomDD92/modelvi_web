import { PostType, ScheduleStatus } from "@/utils/const";
import { getDateTime } from "@/utils/string";
import { Button, Card, Flex, Select, Table, Tooltip } from "antd";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import Media from "../common/Media";

const AdminScheduleResultTable = ({
  loading,
  dataSource,
  pagination: {
    current,
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
  },
  actions: {
    onCreate,
    onEdit,
    onDelete
  }
}) => {

  const getScheduleStatusName = (value) => {
    switch (value) {
      case ScheduleStatus.WAITING:
        return "waiting"
      case ScheduleStatus.SCHEDULED:
        return "scheduled"
      case ScheduleStatus.FINISHED:
        return "success"
      case ScheduleStatus.FAILED:
        return "failed"
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
      key: 'owner',
      title: 'Agency',
      width: 120,
      dataIndex: 'schedule',
      render: (value) => value.owner?.name || "-"
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
          <Select
            className="min-w-[250px]"
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

export default AdminScheduleResultTable;