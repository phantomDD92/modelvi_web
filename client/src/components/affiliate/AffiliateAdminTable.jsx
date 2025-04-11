import { Card, Table, Flex, Switch, Avatar, Dropdown, Space, Typography } from "antd";
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
            width: 150,
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/agency.png" /><span>{value}</span></Flex>
        },
        {
            key: 'commission',
            title: 'Commission',
            dataIndex: 'commission',
        },
        {
            key: 'referrer',
            title: 'Referrer',
            dataIndex: 'referrer',
        },
        {
            key: 'clicks',
            title: 'Clicks',
            width: 120,
            dataIndex: 'referrer',
        },
        {
            key: 'attempts',
            title: 'Attempted Registrations',
            width: 120,
            dataIndex: 'referrer',
        },
        {
            key: 'completions',
            title: 'Finalized Registrations',
            width: 120,
            dataIndex: 'referrer',
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
                    <LuPencil /> Change Commission
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