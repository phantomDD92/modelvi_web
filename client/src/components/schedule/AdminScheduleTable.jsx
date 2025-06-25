import { PostType, ScheduleStatus } from "@/utils/const";
import { getDateTime } from "@/utils/string";
import { Button, Card, Flex, Select, Table, Tooltip } from "antd";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import Media from "../common/Media";

const AdminScheduleTable = ({
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
      dataIndex: 'scheduledAt',
      width: 120,
      render: value => getDateTime(value)
    },
    {
      key: 'owner',
      title: 'Agency',
      width: 120,
      dataIndex: 'owner',
      render: (value) => value ? `${value.name}` : "-"
    },
    {
      key: 'actor',
      title: 'Model',
      width: 150,
      dataIndex: 'actor',
      render: (value, record) => value ? `[${value.number}] ${value.name}` : "-"
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
      width: 120,
      dataIndex: 'type',
      render: (value, record) => getPostType(record)
    },
    {
      key: 'folder',
      title: 'Folder',
      dataIndex: 'folder',
      width: 80,
      render: value => value || "-"
    },
    {
      key: 'results',
      title: 'Status',
      width: 200,
      dataIndex: 'results',
      render: value => value.map(result => result.account?.platform ? `${result.account?.platform} : ${getScheduleStatusName(result.status)}` : '').join(" ")
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

export default AdminScheduleTable;