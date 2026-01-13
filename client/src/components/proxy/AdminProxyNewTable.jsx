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
} from "@ant-design/icons";
import moment from "moment";
import { Platform } from "@/utils/const";
import { Brush, CornerDownLeft, Upload } from "lucide-react";

const AdminProxyNewTable = ({
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
        onBack,
    }
}) => {
    const columns = [
        {
            key: 'url',
            title: 'Proxy',
            dataIndex: 'url'
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
            title={<div>Proxy List</div>}
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

export default AdminProxyNewTable