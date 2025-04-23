import React, { useEffect, useState } from "react";
import { Card, Table, Popconfirm, Button, Flex } from "antd";
import { ClearOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { clearAccountErrorForAdmin, clearAccountHistoryForAdmin, loadAccountHistoryForAdmin } from "@/redux/admin/actions";

export const AdminAccountHistoryPage = () => {
  const [loading, setLoading] = useState(false);
  const { platform, accountId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(qs.parse(location.search).page) || 1;

  const history = useSelector(state => state.admin.history)
  const historyCount = useSelector(state => state.admin.historyCount);
  const historyAccount = useSelector(state => state.admin.historyAccount);

  useEffect(() => {
    setLoading(true);
    dispatch(loadAccountHistoryForAdmin(platform, accountId, { page, pageSize: 20 }, () => setLoading(false)))
  }, [loadAccountHistoryForAdmin, platform, accountId, page])

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

  const handleClearHistory = () => {
    dispatch(clearAccountHistoryForAdmin(platform, accountId, handleReloadData))
  }

  const handleClearError = () => {
    dispatch(clearAccountErrorForAdmin(platform, accountId));
  }

  const handleReloadData = () => {
    setLoading(true);
    dispatch(loadAccountHistoryForAdmin(platform, accountId, { page, pageSize: 20 }, () => setLoading(false)))
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, { replace: true });
  }

  return (
    <div>
      <Card
        title={
          <div className="h-20 p-6 text-xl">
            {`${historyAccount ?
              `[${historyAccount.actor?.number}. ${historyAccount.actor?.name} ${historyAccount.platform}] ${historyAccount.alias}`
              : 'Account'}'s  History`}
          </div>
        }
        extra={
          <Flex gap={"large"}>
            <Popconfirm
              title="Confirm"
              description="Are you sure to remove all history?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleClearHistory}
            >
              <Button key="clear" danger icon={<DeleteOutlined />}>Clear History</Button>
            </Popconfirm>
            <Button key="error" icon={<ClearOutlined />} onClick={handleClearError}>Clear Error</Button>
            <Button
              key="return"
              icon={<RollbackOutlined />}
              onClick={() => navigate(-1)}>
              Return
            </Button>
          </Flex>
        }
      >
        <Table
          pagination={{
            position: ["topRight", "bottomRight"],
            showTotal: total => `Total ${total} histories`,
            current: page,
            total: historyCount,
            onChange: handlePageChange
          }}
          loading={loading}
          rowKey={row => row._id}
          dataSource={history}
          columns={columns}
        />
      </Card>
    </div>
  );
};

export default AdminAccountHistoryPage;
