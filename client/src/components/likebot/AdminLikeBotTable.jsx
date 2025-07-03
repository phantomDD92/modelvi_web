import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Radio,
  Space,
  Table,
  Switch,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  UserAddOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Platform } from "@/utils/const"
import { getPlatformName } from "@/utils/string";
import { StyledSearch } from "../common";
import { LuTrash } from "react-icons/lu";
import moment from "moment";

const AdminLikeBotTable = ({
  pagination,
  rowSelection,
  dataSource,
  loading,
  platform,
  filters: {
    search,
    onSearchChange,
  },
  actions: {
    onStatus,
    onPlatform,
    onCreate,
    onDelete,
    // onEdit,
    // onSetting,
    // onHistory,
    onBulkStatus,
    onBulkDelete,
  }
}) => {
  const columns =
    [
      {
        key: 'name',
        title: 'Name',
        width: 300,
        dataIndex: 'name',
        render: (value, record) =>
          <Space direction="vertical" size={1}>
            <h5>{`${record.firstName} ${record.lastName}`}</h5>
            <span>{`${record.email}`}</span>
          </Space>

      },
      {
        key: 'gender',
        title: 'Gender',
        width: 100,
        dataIndex: 'gender',
      },
      {
        key: 'birthday',
        title: 'Birthday',
        width: 150,
        dataIndex: 'birthday',
        render: value => moment(value).format("YYYY-MM-DD")
      },
      {
        key: 'proxy',
        title: 'Proxy',
        width: 200,
        dataIndex: 'proxy',
        render: value => (value || "").split("@")[1] || ""
      },
      {
        key: 'account',
        title: 'Account',
        dataIndex: 'updatedAt',
        width: 200,
        render: (value, record) =>
          <Space direction="horizontal">
            {record.registered ? <Tag color="success">registered</Tag> : ""}
            {record.verified && <Tag color="success">verified</Tag>}
          </Space>

      },
      {
        key: 'lastError',
        title: 'Last Error',
        dataIndex: 'lastError',
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
            onChange={(status) => onStatus && onStatus(record, status)}
          />
        )
      },
      {
        key: 'action',
        title: 'Action',
        width: 150,
        render: (_, record) =>
          <Dropdown.Button
            onClick={() => onDelete && onDelete(record)}
            menu={{
              items: [
                // {
                //     label: 'Edit Settings',
                //     key: 'settings',
                //     icon: <SolutionOutlined />,
                // },
                // {
                //     label: 'View History',
                //     key: 'history',
                //     icon: <ReadOutlined />,
                // },
                // {
                //     label: 'Delete Account',
                //     key: 'delete',
                //     icon: <DeleteOutlined />,
                //     danger: true,
                // },
              ],
              onClick: (e) => {
                switch (e.key) {
                  // case "settings":
                  //     onSetting && onSetting(record)
                  //     break;
                  // case "history":
                  //     onHistory && onHistory(record)
                  //     break;
                  // case "delete":
                  //     onDelete && onDelete(record)
                  //     break;
                  default:
                    break;
                }
              }
            }}>
            <LuTrash /> Delete
          </Dropdown.Button>
      },
    ]

  return (
    <Card
      title={
        <Flex align="center">
          <span className="mr-8">
            Like Bot List
          </span>
          <Radio.Group onChange={(e) => onPlatform && onPlatform(e.target.value)} value={platform}>
            {[Platform.FANLIKE].map(platform => <Radio.Button value={platform}>{getPlatformName(platform)}</Radio.Button>)}
          </Radio.Group>
        </Flex>
      }
      extra={
        <Flex gap="small">
          <StyledSearch
            defaultValue={search}
            onSearch={value => onSearchChange && onSearchChange(value)}
          />
          <Button
            icon={<UserAddOutlined />}
            onClick={() => onCreate && onCreate()}>
            Create
          </Button>
        </Flex>
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
              {`Enable ${rowSelection.selectedRowKeys.length} accounts`}
            </Button>
            <Button
              key="disable"
              icon={<EyeInvisibleOutlined />}
              onClick={() => onBulkStatus && onBulkStatus(false)}>
              {`Disable ${rowSelection.selectedRowKeys.length} accounts`}
            </Button>
            <Button
              key="delete"
              icon={<DeleteOutlined />}
              danger
              onClick={() => onBulkDelete && onBulkDelete()}>
              {`Delete ${rowSelection.selectedRowKeys.length} accounts`}
            </Button>
          </>
        }
      </Space>
      <Table
        pagination={{
          ...pagination,
          pageSizeOptions: [10, 20, 50, 100],
          position: ["topRight", "bottomRight"],
          showTotal: total => `Total ${total} bots`,
        }}
        rowSelection={rowSelection}
        loading={loading}
        rowKey={row => row._id}
        dataSource={dataSource}
        columns={columns}
      />
    </Card>
  );
}

export default AdminLikeBotTable