import {
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
import { Platform } from "@/utils/const"
import { getDateTime, getPlatformName } from "@/utils/string";
import { StyledSearch } from "../common";
import moment from "moment";
import { LuImport, LuPause, LuPlay, LuSettings, LuTrash } from "react-icons/lu";

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
    // onCreate,
    onDelete,
    // onEdit,
    onSettings,
    onImport,
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
        title: 'Gender / Birthday',
        width: 150,
        dataIndex: 'gender',
        render: (value, record) =>
          <Space direction="vertical" size={1}>
            <h5>{value}</h5>
            <span>{`${moment(record.birthday).format("YYYY-MM-DD")}`}</span>
          </Space>

      },
      // {
      //   key: 'proxy',
      //   title: 'Proxy',
      //   width: 200,
      //   dataIndex: 'proxy',
      //   render: value => (value || "").split("@")[1] || ""
      // },
      {
        key: 'following',
        title: 'Follows / Likes / Comments',
        dataIndex: 'followings',
        width: 250,
        render: (value, record) =>
          <Space direction="vertical" size={0}>
            <span>{`${record.followings || 0} follows`}</span>
            <span>{`${record.likes || 0} likes`}</span>
            <span>{`${record.comments || 0} comments`}</span>
          </Space>
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
        key: 'lastTime',
        title: 'Last Time',
        dataIndex: 'updatedAt',
        render: value => moment().subtract(3, "hour").isAfter(value)
          ? <div className="text-red-500">{getDateTime(value)}</div>
          : <div className="text-green-500">{getDateTime(value)}</div>,
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
            {[Platform.FANLIKE, Platform.FETLIFELIKE].map(platform => <Radio.Button value={platform}>{getPlatformName(platform)}</Radio.Button>)}
          </Radio.Group>
        </Flex>
      }
      extra={
        <Flex gap="small">
          <StyledSearch
            defaultValue={search}
            onSearch={value => onSearchChange && onSearchChange(value)}
          />
          {/* <Button
            icon={<LuUserPlus />}
            onClick={() => onCreate && onCreate()}>
            Create
          </Button> */}
          <Button
            icon={<LuImport />}
            onClick={() => onImport && onImport()}>
            Import
          </Button>
          <Button
            icon={<LuSettings />}
            onClick={() => onSettings && onSettings()}>
            Settings
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
              icon={<LuPlay />}
              onClick={() => onBulkStatus && onBulkStatus(true)}>
              {`Run ${rowSelection.selectedRowKeys.length} accounts`}
            </Button>
            <Button
              key="disable"
              icon={<LuPause />}
              onClick={() => onBulkStatus && onBulkStatus(false)}>
              {`Stop ${rowSelection.selectedRowKeys.length} accounts`}
            </Button>
            <Button
              key="delete"
              icon={<LuTrash />}
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