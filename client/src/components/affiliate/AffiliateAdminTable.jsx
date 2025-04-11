import { getFiatAmount } from "@/utils/string";
import { Card, Table, Flex, Avatar, Dropdown } from "antd";
import { render } from "react-dom";
import { LuPencil } from "react-icons/lu";

export const AffiliateAgencyTable = ({
    pagination,
    dataSource,
    loading,
    actions: {
    },
}) => {
    const columns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/agency.png" /><span>{value}</span></Flex>
        },
        {
            key: 'referralCode',
            title: 'Affiliate Link',
            dataIndex: 'referralCode',
            render: value => value ? `https://modelvi.com?ref=${value}`: '-'
        },
        {
            key: 'commission',
            title: 'Commission',
            width: 120,
            dataIndex: 'commission',
            render: value => `${value} %`
        },
        {
            key: 'referrer',
            title: 'Referrer',
            dataIndex: 'referrer',
            width: 200,
            render: value => value?.name || "-"
        },
        {
            key: 'clicks',
            title: 'Clicks',
            width: 120,
            dataIndex: 'clicks',
        },
        {
            key: 'attempts',
            title: 'Attempted Registrations',
            width: 120,
            dataIndex: 'attempts',
        },
        {
            key: 'completions',
            title: 'Finalized Registrations',
            width: 120,
            dataIndex: 'completions',
        },
        {
            key: 'referees',
            title: 'Referees',
            width: 120,
            dataIndex: 'referees',
        },
        {
            key: 'earnings',
            title: 'Earnings',
            dataIndex: 'earnings',
            render: value => getFiatAmount(value)
        },
        {
            key: 'action',
            title: 'Action',
            width: 200,
            render: (_, record) => (
                <Dropdown.Button
                    onClick={() => onCommission && onCommission(record)}
                    menu={{
                        items: [

                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                default:
                                    break;
                            }
                        }
                    }}>
                    <LuPencil /> Commission
                </Dropdown.Button>
            )
        },
    ]

    return (
        <Card title="Affiliate List">
            <Table
                pagination={{
                    ...pagination,
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} agencies`,
                }}
                loading={loading}
                rowKey={row => row._id}
                dataSource={dataSource}
                columns={columns}
            />
        </Card>
    )
};

export default AffiliateAgencyTable;