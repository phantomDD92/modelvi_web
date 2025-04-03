import {
    Card,
    Table,
} from "antd";
import { getCurrencyAmount, getCurrencyName, getDateTime, getFiatAmount } from "@/utils/string";
import { render } from "react-dom";

const PaymentTable = ({
    pagination,
    loading,
    dataSource,
}) => {
    const columns = [
        {
            key: 'createdAt',
            title: 'Date/Time',
            width: 200,
            dataIndex: 'createdAt',
            render: value => getDateTime(value)
        },
        {
            key: 'payCurrency',
            title: 'Currency',
            width: 250,
            dataIndex: 'payCurrency',
            render: value => getCurrencyName(value)
        },
        {
            key: 'payAddress',
            title: 'Address',
            width: 500,
            dataIndex: 'payAddress',
        },
        {
            key: 'paidAmount',
            title: 'Amount',
            width: 150,
            dataIndex: 'paidAmount',
            render: (value, record) => record.status == "cancel" || record.status == "waiting" ? "-" : getCurrencyAmount(value, record.payCurrency, record.status)
        },
        {
            key: 'outcomeAmount',
            title: 'Balance Charge',
            width: 150,
            dataIndex: 'outcomeAmount',
            render: (value, record) => record.status == "finished" ? getFiatAmount(value) : "-"
        },
        {
            key: 'status',
            title: 'Status',
            width: 200,
            dataIndex: 'status',

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