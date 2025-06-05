import { Card, Table, Button, Flex, Switch, Tag, Avatar, Space } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import moment from "moment";
import { getPlatformName } from "@/utils/string";

const DisabledAccountTable = ({ accounts, loading, onHistory, onStatusChange }) => {
    const columns = [
        {
            key: 'name',
            title: 'Model',
            width: 300,
            dataIndex: 'actor',
            render: (value, record) =>
                <Flex gap="middle" align='center'>
                    <Avatar src="/img/actor.png" />
                    <Space direction="vertical" size={1}>
                        <h5>{`[${record.owner?.name || "-"}]`}</h5>
                        <span>{`${value.number}. ${value.name}`}</span>
                    </Space>
                </Flex>
        },
        {
            key: 'alias',
            title: 'Account',
            width: 150,
            dataIndex: 'alias',
            render: (value, record) =>
                <Space direction="vertical" size={1}>
                    <h5>{`[${getPlatformName(record.platform)}]`}</h5>
                    <span>{`${value}`}</span>
                </Space>
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
                loading={loading}
            />
        </Card>
    );
}

export default DisabledAccountTable