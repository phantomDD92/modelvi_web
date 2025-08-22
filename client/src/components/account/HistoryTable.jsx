
import moment from "moment";
import {
  Button,
  Card,
  Flex,
  Table,
  Popconfirm
} from "antd";
import { LuCornerDownLeft, LuTrash, LuTrash2 } from "react-icons/lu";
import { getAccountName } from "@/utils/string";

const HistoryTable = ({
  pagination,
  dataSource,
  loading,
  account,
  actions: {
    onClear,
    onReturn,
    onError,
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
    },
  ]

  return (
    <Card
      title={
        <div className="h-20 p-6 text-xl"> {`${account ? `${getAccountName(account)}` : 'Account'}'s  History`}        </div>
      }
      extra={
        <Flex gap={"large"}>
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove all history?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onClear && onClear()}
          >
            <Button key="clear" danger icon={<LuTrash />}>Clear History</Button>
          </Popconfirm>
          <Button key="error" icon={<LuTrash2 />} onClick={() => onError && onError()}>Clear Error</Button>
          <Button
            key="return"
            icon={<LuCornerDownLeft />}
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

export default HistoryTable