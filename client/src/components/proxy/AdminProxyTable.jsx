import { getPlatformName } from "@/utils/string";
import {
    Button,
    Card,
    Dropdown,
    Table,
} from "antd";
import { Delete, Plus, Eye } from "lucide-react";

const ProxyAdminTable = ({
    pagination,
    rowSelection,
    loading,
    dataSource: {
        agencies,
        modelStats,
        proxyStats,
        accountStats,
    },
    actions: {
        onAppend,
        onDelete,
        onView,
    },
}) => {
    const columns = [
        {
            key: 'name',
            title: 'Agency',
            width: 250,
            dataIndex: 'name',
            render: value => <h5>{value || '-'}</h5>
        },
        {
            key: 'proxies',
            title: 'Proxies',
            width: 80,
            dataIndex: '_id',
            render: value => proxyStats.find(item => item._id == value)?.count || 0
        },
        {
            key: 'models',
            title: 'Models',
            width: 80,
            dataIndex: '_id',
            render: value => modelStats.find(item => item._id == value)?.count || 0
        },
        {
            key: 'accounts',
            title: 'Accounts',
            dataIndex: '_id',
            render: value => accountStats.filter(item => item._id?.creator == value).map(item => `[ ${getPlatformName(item._id?.platform)} ] ${item.count || 0}`).join(" , ")
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
                                icon: <Delete />,
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
                    <Eye /> View
                </Dropdown.Button>
            )
        },
    ]

    return (
        <Card
            title="Agency Proxies"
            extra={
                <Button icon={<Plus />} onClick={() => onAppend && onAppend()}>Append</Button>
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
                dataSource={agencies}
            />
        </Card>

    )
}

export default ProxyAdminTable