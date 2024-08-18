import React, { useEffect } from "react";
import { Card, Table, Popconfirm, Button, Flex } from "antd";
import { ClearOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { clearAccountError, clearAccountHistory, loadAccountHistory } from "@/redux/model/actions";
import moment from "moment";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';

export const AccountHistory = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const { platform, accountId } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    dispatch(loadAccountHistory(platform, accountId, { page, pageSize: 10 }))
  }, [loadAccountHistory, platform, accountId, page])

  const columns = [
    {
      key: 'createdAt',
      title: 'Time',
      dataIndex: 'createdAt',
      width: 200,
      render: value => moment(value).format("YYYY-MM-DD hh:mm")
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
    dispatch(loadAccountHistory(platform, accountId, { page, pageSize: 10 }))
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
            Account History
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
              icon={<RollbackOutlined/>}
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
            total: modelProps.historyCount,
            onChange: handlePageChange
          }}
          rowKey={row => row._id}
          dataSource={modelProps.history}
          columns={columns}
        />
      </Card>
    </div>
  );
};

export default AccountHistory;
