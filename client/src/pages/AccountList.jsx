import React, { useEffect, useState } from "react";
import { Card, Table, Tooltip, Popconfirm, Button, Flex, Modal, Form, Input, Switch, InputNumber, Select, Radio, Tag } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, ReadOutlined, SolutionOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createAccount, deleteAccount, loadAccounts, setAccountStatus, startAllAccount, stopAllAccount, updateAccount, updateAccountParams } from "@/redux/model/actions";
import { Platform } from "@/utils/const";
import moment from "moment";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';

export const AccountList = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [account, setAccount] = useState();
  const [platform, setPlatform] = useState(Platform.F2F)
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    dispatch(loadAccounts(platform, { page, pageSize: 10 }));
  }, [loadAccounts, platform, page])

  const columns = [
    {
      key: 'number',
      title: 'Number',
      dataIndex: 'number',
      width: 100,
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'actor',
      width: 150,
      render: value => value.name
    },
    {
      key: 'alias',
      title: 'Alias',
      width: 150,
      dataIndex: 'alias',
    },
    {
      key: 'email',
      title: 'Email',
      width: 150,
      dataIndex: 'email'
    },
    {
      key: 'password',
      title: 'Password',
      dataIndex: 'password',
      width: 150,
      render: value => value.substr(0, 2) + "***" + value.substr(value.length - 2, 2)
    },
    {
      key: 'bot',
      title: 'Bot',
      dataIndex: 'updatedAt',
      width: 150,
      render: value => value ? moment().diff(moment(value), 'minute', false) < 10 ? <Tag color="success">Running</Tag> : <Tag color="error">Closed</Tag> : <Tag color="error">Closed</Tag>
    },
    {
      key: 'lastError',
      title: 'LastError',
      dataIndex: 'lastError',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (value, record) => (
        <Switch
          checked={value}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
          onChange={(status) => handleSetStatus(record, status)}
        />
      )
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 150,
      render: (_, record) => (
        <Flex gap="large">
          <Tooltip title="Edit Account">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditButtonClick(record)}
            />
          </Tooltip>
          <Tooltip title="Account Params">
            <Button
              icon={<SolutionOutlined />}
              onClick={() => handleParamsButtonClick(record)}
            />
          </Tooltip>
          <Tooltip title="Account History">
            <Button
              icon={<ReadOutlined />}
              onClick={() => handleHistoryButtonClick(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this account?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteAccount(record)}
          >
            <Tooltip title="Remove model">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Flex>
      )
    },
  ]

  const handleSetStatus = (account, status) => {
    dispatch(setAccountStatus(account, status, handleReloadData))
  }

  const handleUpdateAccount = async () => {
    try {
      await form.validateFields();
      const params = form.getFieldsValue();
      if (account) {
        dispatch(updateAccount(platform, account, params, handleReloadData))
      } else {
        dispatch(createAccount(platform, params, handleReloadData));
      }
      setAccount();
      setVisible(false);
    } catch (error) {

    }
  }

  const handleCreateButtonClick = () => {
    setAccount();
    form.resetFields()
    setVisible(true)
  }

  const handleDeleteAccount = (account) => {
    dispatch(deleteAccount(platform, account, handleReloadData));
  }

  const handleEditButtonClick = (account) => {
    setAccount(account);
    form.setFieldsValue({ ...account, actor: account.actor._id })
    setVisible(true);
  }

  const handleHistoryButtonClick = (account) => {
    navigate(`/account/${platform}/${account._id}`);
  }

  const handleParamsButtonClick = (account) => {
    setAccount(account);
    const { commentInterval, notifyInterval, postOffsets, debug } = account.params;
    form.setFieldsValue({
      commentInterval: commentInterval || 3,
      notifyInterval: notifyInterval || 3,
      debug: debug || false,
      postOffsets: postOffsets ? postOffsets.join(",") : "1, 21, 51"
    });
    setShow(true);
  }

  const handleUpdateParams = async () => {
    try {
      await form.validateFields();
      const params = form.getFieldsValue();
      const postOffsets = params.postOffsets.split(",").map(str => parseInt(str.trim()))
      dispatch(updateAccountParams(platform, account, { ...params, postOffsets }, handleReloadData));
    } catch (error) {

    }
  }

  const handleReloadData = () => {
    setShow(false);
    dispatch(loadAccounts(platform, { page, pageSize: 10 }))
  }

  const handleStartAll = () => {
    dispatch(startAllAccount(platform, handleReloadData))
  }

  const handleStopAll = () => {
    dispatch(stopAllAccount(platform, handleReloadData))
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, { replace: true });
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
      <Card
        title={
          <Flex align="center">
            <div className="h-20 p-6 text-xl">
              Account List
            </div>
            <Radio.Group onChange={(e) => setPlatform(e.target.value)} value={platform}>
              <Radio.Button value={Platform.F2F}>{Platform.F2F}</Radio.Button>
              <Radio.Button value={Platform.FNC}>{Platform.FNC}</Radio.Button>
            </Radio.Group>
          </Flex>
        }
        extra={
          <Flex  gap="large">
            <Button
              icon={<UserAddOutlined />}
              onClick={handleCreateButtonClick}>
              Create
            </Button>
            <Button
              onClick={handleStartAll}>
              Start All
            </Button>
            <Button
              onClick={handleStopAll}>
              Stop All
            </Button>
          </Flex>
        }
      >
        <Table
          pagination={{
            position: ["topRight", "bottomRight"],
            showTotal: total => `Total ${total} accounts`,
            current: page,
            total: modelProps.accountsCount,
            onChange: handlePageChange,
          }}
          rowKey={row => row._id}
          dataSource={modelProps.accounts}
          columns={columns}
        />
      </Card>
      <Modal
        title={account ? "Update account" : "Create account"}
        open={visible}
        onOk={handleUpdateAccount}
        onCancel={() => setVisible(false)}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
        >
          <Form.Item name="actor" label="Model" rules={[{ required: true }]}>
            <Select
              options={modelProps.models.map(model => ({
                label: `${model.number}. ${model.name}`,
                value: model._id
              }))}
              disabled={account}
            />
          </Form.Item>
          <Form.Item name="alias" label="Alias" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={"Account Params"}
        open={show}
        onOk={handleUpdateParams}
        onCancel={() => setShow(false)}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
        >
          <Form.Item name="commentInterval" label="Comment Interval" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="notifyInterval" label="Notify Interval" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="postOffsets" label="Post Offsets" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="debug" label="Debug Enabled" rules={[{ required: true }]}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountList;
