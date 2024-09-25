import { Card, Table, Tooltip, Popconfirm, Button, Flex, Image } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined, RollbackOutlined, EditOutlined } from "@ant-design/icons";
import { AdminRole, SERVER_PATH } from "@/utils/const";

export const ModelContentTable = ({ auth, model, onDelete, onCreate, onEdit, onBack, onClear, onSync }) => {
    const hasPermission = (auth, record) => {
        if (auth.role == AdminRole.MANAGER)
            return true
        if (record.owner && record.owner._id == auth._id)
            return true
        return false
    }
    const columns = [
        {
            key: 'image',
            title: 'Image',
            dataIndex: 'image',
            width: 150,
            render: value => <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
        },
        {
            key: 'tags',
            title: 'Tags',
            dataIndex: 'tags',
        },
        {
            key: 'folder',
            title: 'Folder',
            dataIndex: 'folder',
            width: 100,
            render: value => value || "-"
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) => (
                <Flex gap="small">
                    <Tooltip title="Edit content">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to delete this content?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record)}
                    >
                        <Tooltip title="Delete content">
                            <Button icon={<DeleteOutlined />} danger />
                        </Tooltip>
                    </Popconfirm>
                </Flex>
            )
        },
    ]

    return (
        <Card
            title={
                <div className="h-20 p-6 text-xl">
                    {model && model.name ? `${model.name}'s Content` : `Model's Content`}
                </div>
            }
            extra={
                <Flex gap="small">
                    <Button
                        key="create"
                        icon={<PlusOutlined />}
                        onClick={onCreate}>
                        Create
                    </Button>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to clear all contents?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={onClear}
                    >
                        <Button
                            key="clear"
                            icon={<DeleteOutlined />}
                            danger>
                            Clear
                        </Button>
                    </Popconfirm>
                    {
                        model && model.updated &&
                        <Button
                            key="sync"
                            icon={<UploadOutlined />}
                            onClick={onSync}>
                            Sync
                        </Button>
                    }
                    <Button
                        key="return"
                        icon={<RollbackOutlined />}
                        onClick={onBack}>
                        Return
                    </Button>
                </Flex>
            }
        >
            <Table
                pagination={{ position: ["topRight", "bottomRight"], showTotal: total => `Total ${total} contents` }}
                rowKey={row => row._id}
                dataSource={model ? model.contents: []}
                columns={columns}
            />
        </Card>
    )
};

export default ModelContentTable;