import { Card, Table, Tooltip, Popconfirm, Button, Flex, Image, Tag } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined, RollbackOutlined, EditOutlined } from "@ant-design/icons";
import { AdminRole, Platform, SERVER_PATH } from "@/utils/const";
import Media from "../common/Media";
import { render } from "react-dom";

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
            key: 'platforms',
            title: 'Platforms',
            dataIndex: 'platforms',
            width: 200,
            render: value => value && value.length > 0 ?
                <Flex gap="4px 0" wrap>{value.map(tag => <Tag key={tag} color="processing">{tag}</Tag>)}</Flex>
                : <Flex gap="4px 0" wrap><Tag key={Platform.F2F} color="processing">{Platform.F2F}</Tag><Tag key={Platform.FNC} color="processing">{Platform.FNC}</Tag></Flex>
        },
        {
            key: 'media',
            title: 'Media',
            dataIndex: 'image',
            width: 150,
            render: (value, record) => {
                if (record.media && record.media.length > 0) {
                    return <Media src={record.media[0].name} type={record.media[0].mode} width={100} small />
                } else if (record.image) {
                    return <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
                }
            }
        },
        {
            key: 'preview',
            title: 'Preview',
            dataIndex: 'preview',
            width: 150,
            render: value => value && value.name ? <Media src={value.name} type={value.mode} width={100} small /> : '-'
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
            render: (value, record) => record.postTags && record.postTags.length > 0 ? record.postTags.map(tag => `#${tag}`).join(" ") : (record.tags || "-")
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
            title={model && model.name ? `${model.name}'s Content` : `Model's Content`}
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
                dataSource={model ? model.contents : []}
                columns={columns}
            />
        </Card>
    )
};

export default ModelContentTable;