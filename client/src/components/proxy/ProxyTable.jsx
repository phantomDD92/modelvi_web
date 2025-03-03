import { 
    Button, 
    Card, 
    Space,
    Switch, 
    Table, 
    Tag, 
} from "antd";
import { 
    ClearOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined, 
    UploadOutlined, 
} from "@ant-design/icons";
import moment from "moment";

const ProxyTable = ({
    pagination,
    rowSelection,
    loading,
    dataSource,
    actions: {
        onClear,
        onDelete,
        onAppend,
        onStatus,
        onBulkDelete,
        onBulkStatus
    }
}) => {
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
            key: 'fan',
            title: 'F2F',
            width: 100,
            dataIndex: 'usage',
            render: value => value?.F2F || '-'
        },
        {
            key: 'fan',
            title: 'Fancentro',
            width: 100,
            dataIndex: 'usage',
            render: value => value?.FNC || '-'
        },
        {
            key: 'fan',
            title: 'Fansly',
            width: 100,
            dataIndex: 'usage',
            render: value => value?.FAN || '-'
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
                    onChange={(status) => onStatus(record, status)}
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
                <div>
                    Proxy List&nbsp;(
                    <a href="https://proxy-seller.com/?partner=JRKRDS2FS7PGXQ" target="_blank">Proxy Seller</a>
                    &nbsp;-&nbsp;
                    <a href="https://billing.rayobyte.com/hosting/aff.php?aff=2556&redirectTo=https://rayobyte.com" target="_blank">Rayobyte Proxy</a>
                    )
                </div>
            }
            extra={
                <Space align='center' size="middle">
                    <Button
                        key="clear"
                        danger
                        icon={<ClearOutlined />}
                        onClick={onClear}>
                        Clear
                    </Button>
                    <Button
                        key="append"
                        icon={<UploadOutlined />}
                        onClick={onAppend}>
                        Append
                    </Button>
                </Space>
            }
        >
            <Space align='center' size="middle">
                {rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length > 0 &&
                    <>
                        <h3>Bulk Actions : </h3>
                        <Button
                            key="enable"
                            icon={<EyeOutlined />}
                            onClick={() => onBulkStatus && onBulkStatus(true)}>
                            {`Enable ${rowSelection.selectedRowKeys.length} proxies`}
                        </Button>
                        <Button
                            key="disable"
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => onBulkStatus && onBulkStatus(false)}>
                            {`Disable ${rowSelection.selectedRowKeys.length} proxies`}
                        </Button>
                        <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={onBulkDelete}>
                            {`Delete ${rowSelection.selectedRowKeys.length} proxies`}
                        </Button>
                    </>
                }
            </Space>
            <Table
                pagination={{
                    ...pagination,
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} proxies`,
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

export default ProxyTable