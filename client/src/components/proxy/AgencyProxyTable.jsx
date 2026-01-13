import {
    Button,
    Card,
    Select,
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
import { Platform } from "@/utils/const";
import { Brush, CornerDownLeft, Upload } from "lucide-react";

const AgencyProxyTable = ({
    agency,
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
        onBulkStatus,
        onReset,
        onBack,
    }
}) => {
    const columns = [
        {
            key: 'url',
            title: 'Proxy',
            width: 200,
            dataIndex: 'url'
        },
        // {
        //     key: 'agency',
        //     title: 'Agency',
        //     width: 120,
        //     dataIndex: 'owner',
        //     render: value => value && value.name ? value.name : '-'
        // },
        // {
        //     key: 'expiry',
        //     title: 'Expiry',
        //     width: 200,
        //     dataIndex: 'expiredAt',
        //     render: (value) => (
        //         <div className="flex">
        //             <span>{moment(value).format("YYYY-MM-DD")}&nbsp;&nbsp;</span>
        //             {
        //                 moment(value).diff(moment(), 'day') > 3 ?
        //                     <Tag color="success">valid</Tag>
        //                     : moment(value).diff(moment(), 'day') > 0 ?
        //                         <Tag color="warning">expiring</Tag>
        //                         : <Tag color="error">expired</Tag>
        //             }
        //         </div>
        //     )
        // },
        {
            key: 'f2f',
            title: 'F2F',
            width: 100,
            dataIndex: 'usage',
            render: (value, record) => value?.F2F ? <Space><span>{value?.F2F}</span><ClearOutlined onClick={() => onReset && onReset(record, Platform.F2F)} /></Space> : <span>-</span>
        },
        {
            key: 'fnc',
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
            render: (value, record) => value?.FAN ? <Space><span>{value?.FAN}</span><ClearOutlined onClick={() => onReset && onReset(record, Platform.FAN)} /></Space> : <span>-</span>
        },
        {
            key: 'knky',
            title: 'Knky',
            width: 100,
            dataIndex: 'usage',
            render: (value, record) => value?.KNKY ? <Space><span>{value?.KNKY}</span><ClearOutlined onClick={() => onReset && onReset(record, Platform.KNKY)} /></Space> : <span>-</span>
        },
        {
            key: 'maloum',
            title: 'Maloum',
            width: 100,
            dataIndex: 'usage',
            render: (value, record) => value?.MALOUM ? <Space><span>{value?.MALOUM}</span><ClearOutlined onClick={() => onReset && onReset(record, Platform.MALOUM)} /></Space> : <span>-</span>
        },
        {
            key: 'status',
            title: 'Status',
            width: 200,
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
            width: 200,
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
                    {`${agency?.name || ''} `}Proxy List&nbsp;(
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
                        icon={<Brush />}
                        onClick={onClear}>
                        Clear
                    </Button>
                    <Button
                        key="append"
                        icon={<Upload />}
                        onClick={onAppend}>
                        Append
                    </Button>
                    <Button
                        key="back"
                        icon={<CornerDownLeft />}
                        onClick={onBack}>
                        Back
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
                    pageSizeOptions: [10, 20, 50, 100],
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

export default AgencyProxyTable