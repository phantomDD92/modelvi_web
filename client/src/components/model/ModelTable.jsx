import { Card, Table, Tooltip, Popconfirm, Button, Flex, Tag, Avatar } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, ReadOutlined, SolutionOutlined } from "@ant-design/icons";
import moment from "moment";
import { AdminRole } from "@/utils/const";

export const ModelTable = ({ auth, models, modelsCount, page, onPageChange, onDelete, onCreate, onEdit, onContent, onProfile }) => {
    const hasPermission = (auth, record) => {
        if (auth.role == AdminRole.MANAGER)
            return true
        if (record.owner && record.owner._id == auth._id)
            return true
        return false
    }
    const columns = [
        {
            key: 'number',
            title: 'No',
            dataIndex: 'number',
            width: 50,
        },
        {
            key: 'name',
            title: 'Name',
            width: 200,
            dataIndex: 'name',
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/actor.png" /><span>{value}</span></Flex>
        },
        {
            key: 'owner',
            title: 'Agency',
            width: 150,
            dataIndex: 'owner',
            render: value => value && value.name ? value.name : "-"
        },
        {
            key: 'age',
            title: 'Age',
            width: 100,
            dataIndex: 'birthday',
            render: value => moment(value).diff(moment(), 'year', false) || '-'
        },
        {
            key: 'birthplace',
            title: 'Birth Place',
            width: 200,
            dataIndex: 'birthplace'
        },
        {
            key: 'discord',
            title: 'Discord',
            dataIndex: 'discord',
            width: 150,
            render: value => value ? <Tag color="success">Yes</Tag> : <Tag color="error">No</Tag>
        },
        {
            key: 'contents',
            title: 'Contents',
            dataIndex: 'contents',
            width: 150,
            render: value => value ? value.length : '-'
        },
        {
            key: 'accounts',
            title: 'Accounts',
            dataIndex: 'accounts',
            render: value => value.length == 0 ? '-' : <Flex gap="small">{value.map(el => <Tag color="success">{el.platform}</Tag>)}</Flex>
        },
        {
            key: 'operation',
            title: 'Operation',
            width: 150,
            render: (_, record) =>  hasPermission(auth, record) ? (
                <Flex gap="small">
                    <Tooltip title="Edit Model Info">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Edit Contents">
                        <Button icon={<ReadOutlined />} onClick={() => onContent(record)} />
                    </Tooltip>
                    <Tooltip title="Edit Profile">
                        <Button icon={<SolutionOutlined />} onClick={() => onProfile(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to delete this model?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record)}
                    >
                        <Tooltip title="Delete Model">
                            <Button icon={<DeleteOutlined />} danger />
                        </Tooltip>
                    </Popconfirm>
                </Flex>
            ) : ""
        },
    ];

    return (
        <Card
            title={
                <div className="h-20 p-6 text-xl">
                    Model List
                </div>
            }
            extra={
                <Button
                    icon={<UserAddOutlined />}
                    onClick={onCreate}>
                    Create
                </Button>
            }
        >
            <Table
                pagination={{
                    position: ["topRight", "bottomRight"],
                    showTotal: total => `Total ${total} models`,
                    current: page,
                    total: modelsCount,
                    onChange: onPageChange,
                }}
                rowKey={row => row._id}
                dataSource={models}
                columns={columns}
            />
        </Card>
    )
};

export default ModelTable;