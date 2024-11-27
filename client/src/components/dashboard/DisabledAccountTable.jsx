import { Card, Table, Button, Flex, Switch, Tag, Avatar } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import moment from "moment";

const DisabledAccountTable = ({ accounts, onHistory, onStatusChange }) => {
    const columns = [
        {
            key: 'number',
            title: 'No.',
            dataIndex: 'number',
            width: 50,
        },
        {
            key: 'name',
            title: 'Name',
            width: 150,
            dataIndex: 'actor',
            render: value => <Flex gap="middle" align='center'><Avatar src="/img/actor.png" /><span>{value.name}</span></Flex>
        },
        {
            key: 'owner',
            title: 'Agency',
            width: 120,
            dataIndex: 'owner',
            render: value => value && value.name ? value.name : "-"
        },
        {
            key: 'platform',
            title: 'Platform',
            width: 120,
            dataIndex: 'platform',
        },
        {
            key: 'alias',
            title: 'Alias',
            width: 150,
            dataIndex: 'alias',
        },
        {
            key: 'email',
            title: 'Email',
            width: 150,
            dataIndex: 'email',
        },
        {
            key: 'bot',
            title: 'Bot',
            dataIndex: 'updatedAt',
            width: 150,
            render: value => value ? moment().diff(moment(value), 'minute', false) < 10 ? <Tag color="success">Running</Tag> : <Tag color="error">Closed</Tag> : <Tag color="error">Closed</Tag>
        },
        {
            key: 'lastError',
            title: 'LastError',
            dataIndex: 'lastError',
        },
        {
            key: 'updatedAt',
            title: 'LastTime',
            dataIndex: 'updatedAt',
            render: value => moment(value).format("YYYY-MM-DD hh:mm")
        },
        {
            key: 'status',
            title: 'Status',
            dataIndex: 'status',
            width: 120,
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
            width: 150,
            render: (_, record) =>
                <Button
                    onClick={() => onHistory(record)}>
                    <ReadOutlined /> History
                </Button>
        },
    ]

    return (
        <Card
            title={
                <Flex align="center">
                    <span className="mr-8">
                        Disabled Accounts
                    </span>
                </Flex>
            }
        >
            <Table
                pagination={false}
                rowKey={row => row._id}
                dataSource={accounts}
                columns={columns}
            />
        </Card>
    );
}

export default DisabledAccountTable