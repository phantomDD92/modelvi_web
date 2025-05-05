import {
  Card,
  Flex,
  Radio,
  Table,
  Tag,
} from "antd";
import { getCurrencyAmount, getCurrencyName, getDateTime, getFiatAmount } from "@/utils/string";
import { AgencySelect } from "../agency";

const AdminPaymentsTable = ({
  filters: {
    agency,
    agencyList,
    onAgencyChange,
    status,
    onStatusChange,
  },
  pagination,
  loading,
  dataSource,
}) => {
  const getStatusTag = (status) => {
    switch (status) {
      case "finished":
        return <Tag color="success">finished</Tag>
      case "failed":
        return <Tag color="error">failed</Tag>
      case "waiting":
        return <Tag color="processing">waiting</Tag>
      case "expired":
        return <Tag color="warning">expired</Tag>
      default:
        break;
    }
    return <Tag color="default">{status}</Tag>
  }
  const columns = [
    {
      key: 'createdAt',
      title: 'Date/Time',
      width: 200,
      dataIndex: 'createdAt',
      render: value => getDateTime(value)
    },
    {
      key: 'agency',
      title: 'Agency',
      width: 200,
      dataIndex: 'agency',
      render: value => value?.name || "-"
    },
    {
      key: 'payAddress',
      title: 'Address',
      width: 300,
      dataIndex: 'payAddress',
      render: (value, record) => <div><h4>{getCurrencyName(record.payCurrency)}</h4><p>{value}</p></div>
    },
    {
      key: 'paidAmount',
      title: 'Paid Amount',
      width: 150,
      dataIndex: 'paidAmount',
      render: (value, record) => record.status == "cancel" || record.status == "waiting" ? "-" : getCurrencyAmount(value, record.payCurrency, record.status)
    },
    {
      key: 'outcomeAmount',
      title: 'Received Amount',
      width: 150,
      dataIndex: 'outcomeAmount',
      render: (value, record) => record.status == "cancel" || record.status == "waiting" ? "-" : getCurrencyAmount(value, record.outcomeCurrency, record.status)
    },
    {
      key: 'chargeAmount',
      title: 'Charged Balance',
      width: 150,
      dataIndex: 'chargeAmount',
      render: (value, record) => record.status == "finished" ? getFiatAmount(value) : "-"
    },
    {
      key: 'status',
      title: 'Status',
      width: 200,
      dataIndex: 'status',
      render: value => getStatusTag(value)
    },
  ]

  return (
    <Card
      title={
        <span className="mr-8">
          Payments List
        </span>
      }
      extra={<Flex gap={16}>
        <Radio.Group onChange={(e) => onStatusChange && onStatusChange(e.target.value)} value={status}>
          <Radio.Button value="">All</Radio.Button>
          <Radio.Button value="finished">Finished</Radio.Button>
          <Radio.Button value="waiting">Waiting</Radio.Button>
          <Radio.Button value="cancel">Canceled</Radio.Button>
          <Radio.Button value="expired">Expired</Radio.Button>
          <Radio.Button value="failed">Failed</Radio.Button>
        </Radio.Group>
        <AgencySelect
          all
          value={agency}
          dataSource={agencyList}
          onChange={value => onAgencyChange && onAgencyChange(value)}
        />
      </Flex>}
    >
      <Table
        pagination={{
          ...pagination,
          position: ["topRight", "bottomRight"],
          showTotal: total => `Total ${total} payments`,
        }}
        loading={loading}
        rowKey={row => row._id}
        columns={columns}
        dataSource={dataSource}
      />
    </Card>

  )
}

export default AdminPaymentsTable