import {
    Card,
    Table,
} from "antd";
import { getDateTime, getFiatAmount } from "@/utils/string";
import { render } from "react-dom";

const TransactionTable = ({
    pagination,
    loading,
    dataSource,
}) => {
    console.log(dataSource);
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
        },
        {
            key: 'amount',
            title: 'Amount',
            width: 100,
            dataIndex: 'amount',
            value: value => getFiatAmount(value),
        },
        {
            key: 'to',
            title: 'Balance',
            width: 100,
            dataIndex: 'to',
            render: value => getFiatAmount(value)
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