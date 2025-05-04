import React, { useEffect, useState } from "react";
import { Card, Table, Popconfirm, Button, Flex } from "antd";
import { ClearOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { clearAccountError, clearAccountHistory, loadAccountHistory } from "@/redux/model/actions";
import moment from "moment";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';

export const AccountHistoryPage = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const modelProps = useSelector(state => state.model)
  const { platform, accountId } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    setLoading(true);
    dispatch(loadAccountHistory(platform, accountId, { page, pageSize: 10 }, () => setLoading(false)))
  }, [loadAccountHistory, platform, accountId, page])

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
    dispatch(clearAccountHistory(platform, accountId, handleReloadData))
  }

  const handleClearError = () => {
    dispatch(clearAccountError(platform, accountId));
  }

  const handleReloadData = () => {
    setLoading(true);
    dispatch(loadAccountHistory(platform, accountId, { page, pageSize: 10 }, () => setLoading(false)))
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
            {`${modelProps.historyAccount ?
              `[${modelProps.historyAccount.actor.number}.${modelProps.historyAccount.actor.name} ${modelProps.historyAccount.platform}] ${modelProps.historyAccount.alias}`
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
            pageSize: 20,
            total: modelProps.historyCount,
            onChange: handlePageChange
          }}
          loading={loading}
          rowKey={row => row._id}
          dataSource={modelProps.history}
          columns={columns}
        />
      </Card>
    </div>
  );
};

export default AccountHistoryPage;
