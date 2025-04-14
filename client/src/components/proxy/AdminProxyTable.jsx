import {
    Button,
    Card,
    Dropdown,
    Table,
} from "antd";
import { LuDelete, LuPlus, LuView } from "react-icons/lu";

const ProxyAdminTable = ({
    pagination,
    rowSelection,
    loading,
    dataSource,
    actions: {
        onAppend,
        onDelete,
        onView,
    },
}) => {
    const columns = [
        {
            key: 'agency',
            title: 'Agency',
            width: 200,
            dataIndex: 'agencyName',
            render: value => value || '-'
        },
        {
            key: 'total',
            title: 'Total Proxies',
            dataIndex: 'totalProxies',
        },
        {
            key: 'valid',
            title: 'Valid Proxies',
            dataIndex: 'validProxies',
        },
        {
            key: 'disabled',
            title: 'Disabled Proxies',
            dataIndex: 'disabledProxies',
        },
        {
            key: 'expired',
            title: 'Expired Proxies',
            dataIndex: 'expiredProxies',
        },
        {
            key: 'action',
            title: 'Action',
            width: 200,
            render: (_, record) => (
                <Dropdown.Button
                    onClick={() => onView && onView(record)}
                    menu={{
                        items: [
                            {
                                label: 'Delete',
                                key: 'delete',
                                icon: <LuDelete />,
                                danger: true
                            },
                        ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "delete":
                                    onDelete && onDelete(record)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }}>
                    <LuView /> View
                </Dropdown.Button>
            )
        },
    ]

    return (
        <Card
            title={<div> Agency Proxies </div>}
            extra={
                <Button icon={<LuPlus />} onClick={() => onAppend && onAppend()}>Append</Button>
            }>
            <Table
                pagination={{
                    ...pagination,
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} agencies`,
                }}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={row => row._id}
                columns={columns}
                dataSource={dataSource}
            />
        </Card>

    )
}

export default ProxyAdminTable