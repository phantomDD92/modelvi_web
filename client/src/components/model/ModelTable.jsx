import { Card, Table, Button, Flex, Tag, Avatar, Dropdown } from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined, UserAddOutlined, ReadOutlined, SolutionOutlined } from "@ant-design/icons";
import moment from "moment";
import { AdminRole } from "@/utils/const";

export const ModelTable = ({ auth, models, loading, modelsCount, page, pageSize, onPageChange, onAgencyChange, onDelete, onCreate, onEdit, onContent, onProfile }) => {
    const hasPermission = (auth, record) => {
        if (auth.role == AdminRole.MANAGER)
            return true
        if (record.owner && record.owner._id == auth._id)
            return true
        return false
    }
    const isAdmin = (auth) => {
        return auth.role == AdminRole.MANAGER;
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
            render: value => moment().diff(moment(value), 'year', false) || '-'
        },
        {
            key: 'birthplace',
            title: 'Birth Place',
            width: 200,
            dataIndex: 'birthplace'
        },
        {
            key: 'contents',
            title: 'Contents',
            dataIndex: 'contents',
            width: 150,
            render: value => value ? value.length : '-'
        },
        {
            key: 'updated',
            title: 'Synced',
            dataIndex: 'updated',
            width: 100,
            render: value => value ? <Tag color="error">No</Tag> : <Tag color="processing">Yes</Tag>
        },
        {
            key: 'accounts',
            title: 'Accounts',
            dataIndex: 'accounts',
            render: value => value.length == 0 ? '-' : <Flex gap="small">{value.map(el => <Tag color="success">{el.platform}</Tag>)}</Flex>
        },
        {
            key: 'discord',
            title: 'ChatTeam',
            dataIndex: 'discord',
            width: 150,
            render: value => value?.desc || "-"
        },
        {
            key: 'action',
            title: 'Action',
            width: 150,
            render: (_, record) => hasPermission(auth, record) ? (
                <Dropdown.Button
                    onClick={() => onEdit(record)}
                    menu={{
                        items: isAdmin(auth) ?
                            [
                                {
                                    label: 'View Contents',
                                    key: 'content',
                                    icon: <ReadOutlined />,
                                },
                                {
                                    label: 'Change Agency',
                                    key: 'agency',
                                    icon: <UserOutlined />,
                                },
                                {
                                    label: 'Delete Model',
                                    key: 'delete',
                                    icon: <DeleteOutlined />,
                                    danger: true,
                                },
                            ] :
                            [
                                {
                                    label: 'View Contents',
                                    key: 'content',
                                    icon: <ReadOutlined />,
                                },
                                {
                                    label: 'Delete Model',
                                    key: 'delete',
                                    icon: <DeleteOutlined />,
                                    danger: true,
                                },
                            ],
                        onClick: (e) => {
                            switch (e.key) {
                                case "content":
                                    onContent(record)
                                    break;
                                case "profile":
                                    onProfile(record)
                                    break;
                                case "delete":
                                    onDelete(record)
                                    break;
                                case "agency":
                                    onAgencyChange(record)
                                    break;
                                default:
                                    break;
                            }
                        }
                    }}>
                    <EditOutlined /> Edit
                </Dropdown.Button>
            ) : ""
        },
    ];

    return (
        <Card
            title={"Model List"}
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
                    pageSize: pageSize,
                    total: modelsCount,
                    onChange: onPageChange,
                }}
                loading={loading}
                rowKey={row => row._id}
                dataSource={models}
                columns={columns}
            />
        </Card>
    )
};

export default ModelTable;