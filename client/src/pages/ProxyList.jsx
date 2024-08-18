import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Popconfirm, Switch, Table, Tag, Tooltip, Input, Modal, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addProxies, clearProxies, deleteProxy, loadProxies, setProxyStatus } from "@/redux/proxy/actions";
import { DeleteOutlined, UploadOutlined, ClearOutlined } from "@ant-design/icons";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import qs from 'query-string';
import { toast } from "react-hot-toast";

export const ProxyList = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [date, setDate] = useState();
  const dispatch = useDispatch()
  const proxyProps = useSelector(state => state.proxy)
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    dispatch(loadProxies({ page, pageSize: 10 }))
  }, [loadProxies, page])

  const columns = [
    {
      key: 'url',
      title: 'Proxy',
      dataIndex: 'url'
    },
    {
      key: 'expiry',
      title: 'Expiry',
      dataIndex: 'expiredAt',
      render: (value) => (
        <div className="flex">
          <span>{moment(value).format("YYYY-MM-DD")}</span>
          {
            moment(value).diff(moment(), 'day') > 3 ?
              <Tag color="success">valid</Tag>
              : moment(value).diff(moment(), 'day') > 0 ?
                <Tag color="warning">expiring</Tag>
                : <Tag color="error">expired</Tag>
          }
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value, record) => (
        <Switch
          checked={value}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
          onChange={(status) => handleSetProxyStatus(record, status)}
        />
      )
    },
    {
      key: 'operation',
      title: 'Operation',
      render: (_, record) => (
        <Popconfirm
          title="Confirm"
          description="Are you sure to remove this proxy?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDeleteProxy(record)}
        >
          <Tooltip title="Remove proxy">
            <Button shape="circle" icon={<DeleteOutlined />} danger />
          </Tooltip>
        </Popconfirm>
      )
    },
  ]

  const handleReloadData = () => {
    dispatch(loadProxies({ page, pageSize: 10 }))
  }

  const handleSetProxyStatus = (proxy, status) => {
    dispatch(setProxyStatus(proxy, status, handleReloadData))
  }

  const handleClearProxies = () => {
    dispatch(clearProxies(handleReloadData))
  }

  const handleDeleteProxy = (proxy) => {
    dispatch(deleteProxy(proxy, handleReloadData));
  }

  const handleUploadProxies = () => {
    if (!date || text.trim() == "") {
      toast.error("Please input empty values");
      return
    }
    const proxies = []
    text.split("\n").forEach(entry => {
      if (entry.trim() !== "") {
        proxies.push(entry.trim())
      }
    })
    dispatch(addProxies(proxies, date.toDate(), handleReloadData))
    setVisible(false)
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, {replace: true});
  }

  return (
    <div>
      <Card
        title={
          <div className="h-20 p-6 text-xl">
            Proxy List
          </div>
        }
        extra={
          <div className="flex gap-4">
            <Popconfirm
              title="Confirm"
              description="Are you sure to remove all proxies?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleClearProxies}
            >
              <Button danger icon={<ClearOutlined />}>Clear</Button>
            </Popconfirm>
            <Button icon={<UploadOutlined />} onClick={() => setVisible(true)}>Upload</Button>
          </div>
        }
      >
        <Table
          pagination={{
            position: ["topRight", "bottomRight"],
            showTotal: total => `Total ${total} proxies`,
            current: page,
            pageSize: 10,
            total: proxyProps.proxiesCount,
            onChange: handlePageChange,
          }}
          rowKey={row => row._id}
          columns={columns}
          dataSource={proxyProps.proxies}
        />
      </Card>
      <Modal
        title="Upload proxies"
        open={visible}
        onOk={handleUploadProxies}
        onCancel={() => setVisible(false)}>
        <Flex gap="middle" vertical={true}>
          <Input.TextArea
            placeholder="username:password@ipaddress:port"
            autoSize={{ minRows: 20, maxRows: 30 }}
            allowClear
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <DatePicker
            placeholder="Expiration date"
            value={date}
            onChange={e => setDate(e)}
          />
        </Flex>
      </Modal>
    </div>
  );
};

export default ProxyList;
