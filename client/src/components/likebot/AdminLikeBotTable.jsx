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
        render: (value, record) => `${record.firstName} ${record.lastName}`
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
        width: 100,
        dataIndex: 'birthday',
        render: value => moment(value).format("YYYY-MM-DD")
      },
      {
        key: 'email',
        title: 'Email',
        width: 200,
        dataIndex: 'email',
      },
      {
        key: 'registered',
        title: 'Registration',
        width: 100,
        dataIndex: 'registered',
        render: value => value ? <Tag color="success">Yes</Tag> : <Tag color="error">No</Tag>
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
            <Radio.Button value={Platform.FAN}>Fansly</Radio.Button>
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