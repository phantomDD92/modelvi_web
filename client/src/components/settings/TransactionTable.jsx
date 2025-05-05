import {
    Card,
    Table,
} from "antd";
import { getAccountName, getDateTime, getFullFiatAmount } from "@/utils/string";
import { TransactionType } from "@/utils/const";

const TransactionTable = ({
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
            width: 200,
            dataIndex: 'createdAt',
            render: value => getDateTime(value)
        },
        {
            key: 'description',
            title: 'Description',
            width: 200,
            dataIndex: 'description',
            render: (value, record) => getTransactionDescription(record),
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
                    Transaction List
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

export default TransactionTable