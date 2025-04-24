import { Platform } from "@/utils/const";
import { Button, Card, Flex, Radio, Table } from "antd";
import { LuPlus } from "react-icons/lu";

const AgencyScheduleTable = ({
  loading,
  dataSource,
  pagination: {
    current,
    total,
    onChange,
  },
  filters: {
    platform,
    onPlatformChange,
  },
  actions: {
    onCreate
  }
}) => {
  const columns = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
    },
  ];
  return (
    <Card
      title={
        <Flex align="center">
          <span className="mr-8">
            Scheduled Posts
          </span>
          <Radio.Group onChange={(e) => onPlatformChange && onPlatformChange(e.target.value)} value={platform}>
            <Radio.Button value={""}>All</Radio.Button>
            <Radio.Button value={Platform.F2F}>F2F</Radio.Button>
            {/* <Radio.Button value={Platform.FNC}>Fancentro</Radio.Button>
            <Radio.Button value={Platform.FAN}>Fansly</Radio.Button>
            <Radio.Button value={Platform.FANVUE}>Fanvue</Radio.Button>
            <Radio.Button value={Platform.KNKY}>Knky</Radio.Button>
            <Radio.Button value={Platform.MALOUM}>Maloum</Radio.Button> */}
          </Radio.Group>
        </Flex>}
      extra={
        <Flex gap="small">
          <Button
            icon={<LuPlus />}
            onClick={() => onCreate && onCreate()}>
            Create
          </Button>
        </Flex>
      }
    >
      <Table
        pagination={{
          current,
          total,
          onChange,
          position: ["topRight", "bottomRight"],
          showTotal: total => `Total ${total} posts`,
        }}
        loading={loading}
        rowKey={row => row._id}
        columns={columns}
        dataSource={dataSource}
      />
    </Card>
  )
}

export default AgencyScheduleTable;