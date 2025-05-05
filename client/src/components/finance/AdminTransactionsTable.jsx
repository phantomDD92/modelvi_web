import {
  Card,
  Flex,
  Radio,
  Table,
} from "antd";
import { getAccountName, getDateTime, getFullFiatAmount } from "@/utils/string";
import { TransactionType } from "@/utils/const";
import { AgencySelect } from "../agency";

const AdminTransactionsTable = ({
  filters: {
    agency,
    agencyList,
    onAgencyChange,
    type,
    onTypeChange,
  },
  pagination,
  loading,
  dataSource,
}) => {
  
  const getTransactionDescription = (record) => {
    switch (record.type) {
      case TransactionType.CHARGE_INVOICE:
        return "Payment by invoice"
      case TransactionType.CHARGE_NOWPAYMENT:
        return "Payment by NOWPayment"
      case TransactionType.EXPENSE:
        return `Expense for ${getAccountName(record.account)}`
      default:
        return record.description
    }
  }

  const columns = [
    {
      key: 'createdAt',
      title: 'Date/Time',
      width: 150,
      dataIndex: 'createdAt',
      render: value => getDateTime(value)
    },
    {
      key: 'agency',
      title: 'Agency',
      width: 250,
      dataIndex: 'agency',
      render: value => value?.name || "-"
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
      render: (value, record) => getTransactionDescription(record)
    },
    {
      key: 'amount',
      title: 'Amount',
      width: 150,
      dataIndex: 'amount',
      render: value => getFullFiatAmount(value),
    },
    {
      key: 'to',
      title: 'Balance',
      width: 200,
      dataIndex: 'to',
      render: (value, record) => `${getFullFiatAmount(record.from)} => ${getFullFiatAmount(value)}`
    },
  ]

  return (
    <Card
      title={
        <span className="mr-8">
          Transactions List
        </span>
      }
      extra={<Flex gap={16}>
        <Radio.Group onChange={(e) => onTypeChange && onTypeChange(e.target.value)} value={type}>
          <Radio.Button value="">All</Radio.Button>
          <Radio.Button value={`${TransactionType.CHARGE_NOWPAYMENT}`}>NOWPayment</Radio.Button>
          <Radio.Button value={`${TransactionType.CHARGE_INVOICE}`}>Invoice</Radio.Button>
          <Radio.Button value={`${TransactionType.EXPENSE}`}>Expense</Radio.Button>
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

export default AdminTransactionsTable