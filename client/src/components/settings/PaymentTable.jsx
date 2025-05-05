import {
    Card,
    Table,
    Tag,
} from "antd";
import { getCurrencyAmount, getCurrencyName, getDateTime, getFiatAmount } from "@/utils/string";
import { render } from "react-dom";

const PaymentTable = ({
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
            key: 'payAddress',
            title: 'Address',
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
                    Payment List
                </span>
            }
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

export default PaymentTable