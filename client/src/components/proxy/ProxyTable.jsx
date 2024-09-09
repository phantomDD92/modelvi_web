import { Button, Card, Popconfirm, Switch, Table, Tag, Flex } from "antd";
import { DeleteOutlined, UploadOutlined, ClearOutlined } from "@ant-design/icons";
import moment from "moment";

const ProxyTable = ({ proxies, proxiesCount, page, onPageChange, onClear, onDelete, onAppend, onStatusChange }) => {
    const columns = [
        {
            key: 'url',
            title: 'Proxy',
            dataIndex: 'url'
        },
        {
            key: 'agency',
            title: 'Agency',
            width: 150,
            dataIndex: 'owner',
            render: value => value && value.name ? value.name : '-'
        },
        {
            key: 'expiry',
            title: 'Expiry',
            width: 250,
            dataIndex: 'expiredAt',
            render: (value) => (
                <div className="flex">
                    <span>{moment(value).format("YYYY-MM-DD")}&nbsp;&nbsp;</span>
                    {
                        moment(value).diff(moment(), 'day') > 3 ?
                            <Tag color="success">valid</Tag>
                            : moment(value).diff(moment(), 'day') > 0 ?
                                <Tag color="warning">expiring</Tag>
                                : <Tag color="error">expired</Tag>
                    }
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            width: 250,
            dataIndex: 'status',
            render: (value, record) => (
                <Switch
                    checked={value}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                    onChange={(status) => onStatusChange(record, status)}
                />
            )
        },
        {
            key: 'action',
            title: 'Action',
            width: 250,
            render: (_, record) => (
                <Button
                    danger
                    onClick={() => onDelete(record)}>
                    <DeleteOutlined /> Delete
                </Button>
            )
        },
    ]

    return (
        <Card
            title={
                <div className="h-20 p-6 text-xl">
                    Proxy List
                </div>
            }
            extra={
                <Flex gap="middle">
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to remove all proxies?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onClear}
                    >
                        <Button danger icon={<ClearOutlined />}>Clear</Button>
                    </Popconfirm>
                    <Button icon={<UploadOutlined />} onClick={onAppend}>Append</Button>
                </Flex>
            }
        >
            <Table
                pagination={{
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} proxies`,
                    current: page,
                    pageSize: 10,
                    total: proxiesCount,
                    onChange: onPageChange,
                }}
                rowKey={row => row._id}
                columns={columns}
                dataSource={proxies}
            />
        </Card>

    )
}

export default ProxyTable