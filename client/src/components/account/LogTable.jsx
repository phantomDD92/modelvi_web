
import moment from "moment";
import {
  Button,
  Card,
  Flex,
  Table,
  Popconfirm,
  Tag,
  Checkbox
} from "antd";
import { CornerDownLeft, Trash, Trash2 } from "lucide-react";
import { getAccountName, getLogAction } from "@/utils/string";
import LogSelect from "./LogSelect";
import { ActionType } from "@/utils/const";


const LogTable = ({
  pagination,
  dataSource,
  loading,
  account,
  actions: {
    onClear,
    onReturn,
    onError,
    failedOnly,
    onFailed,
    logType,
    onLogTypeChange,
  }
}) => {

  const columns = [
    {
      key: 'createdAt',
      title: 'Time',
      dataIndex: 'createdAt',
      width: 200,
      render: value => moment(value).format("YYYY-MM-DD HH:mm")
    },
    {
      key: 'action',
      title: 'Action',
      dataIndex: 'action',
      render: (value, record) => record.success ? <Tag color="success">{getLogAction(value)}</Tag> : <Tag color="error">{getLogAction(value)}</Tag>
    },
    {
      key: 'message',
      title: 'Message',
      dataIndex: 'message',
    },
  ]

  return (
    <Card
      title={
        <div className="h-20 p-6 text-xl"> {`${account ? `${getAccountName(account)}` : 'Account'}'s  History`}        </div>
      }
      extra={

        <Flex gap={"large"} align="center">

          <Checkbox checked={failedOnly} onChange={e => onFailed && onFailed(e.target.checked)}          >
            Failed-Only
          </Checkbox>
          <LogSelect
            all
            dataSource={[ActionType.LOGIN, ActionType.POST, ActionType.SCHEDULE, ActionType.STORY]}
            value={logType}
            onChange={onLogTypeChange} />
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove all history?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onClear && onClear()}
          >
            <Button key="clear" danger icon={<Trash />}>Clear History</Button>
          </Popconfirm>
          <Button key="error" icon={<Trash2 />} onClick={() => onError && onError()}>Clear Error</Button>
          <Button
            key="return"
            icon={<CornerDownLeft />}
            onClick={() => onReturn && onReturn()}>
            Return
          </Button>
        </Flex>
      }
    >
      <Table
        pagination={{
          ...pagination,
          pageSizeOptions: [10, 20, 50, 100],
          position: ["topRight", "bottomRight"],
          showTotal: total => `Total ${total} accounts`,
        }}
        loading={loading}
        rowKey={row => row._id}
        dataSource={dataSource}
        columns={columns}
      />
    </Card>
  );
}

export default LogTable