import {
    Card,
    Table,
} from "antd";
import { getCurrencyAmount, getCurrencyName, getDateTime } from "@/utils/string";
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
            width: 250,
            dataIndex: 'createdAt',
            render: value => getDateTime(value)
        },
        {
            key: 'payCurrency',
            title: 'Currency',
            width: 300,
            dataIndex: 'payCurrency',
            render: value => getCurrencyName(value)
        },
        {
            key: 'payAmount',
            title: 'Amount',
            width: 100,
            dataIndex: 'payAmount',
            render: (value, record) => getCurrencyAmount(value, record.payCurrency, record.status)
        },
        {
            key: 'payAddress',
            title: 'Address',
            width: 500,
            dataIndex: 'payAddress',
        },
        {
            key: 'priceAmount',
            title: 'Balance',
            width: 100,
            dataIndex: 'priceAmount',
            render: (value, record) => record.status == "cancel" || record.status == "waiting" ? "-" : value
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