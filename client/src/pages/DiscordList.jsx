import React, { useEffect, useState } from "react";
import { Card, Popconfirm, Button, Table, Modal, Flex, Input, Tooltip, Form, List } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { appendModel, createDiscord, deleteDiscord, loadAllModels, loadDiscords, loadModels, removeModel, updateDiscord } from "@/redux/model/actions";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';

export const DiscordList = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model);
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false);
  const [discord, setDiscord] = useState()
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  const columns = [
    {
      key: 'desc',
      title: 'Name',
      width: 200,
      dataIndex: 'desc',
      render: (value) => value
    },
    {
      key: 'url',
      title: 'Discord Web Hook',
      dataIndex: 'url'
    },
    {
      key: 'actors',
      title: 'Models',
      width: 200,
      dataIndex: 'actors',
      render: (value) => value.length == 0 ? '-' : `${value.length} models`
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 200,
      render: (_, record) => (
        <Flex gap="large">
          <Tooltip title="Manage Models">
            <Button icon={<UserAddOutlined />} onClick={() => handleAppendButtonClick(record)} />
          </Tooltip>
          <Tooltip title="Edit Discord">
            <Button icon={<EditOutlined />} onClick={() => handleEditButtonClick(record)} />
          </Tooltip>
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this discord url?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteDiscord(record)}
          >
            <Tooltip title="Remove discord url">
              <Button shape="circle" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Flex>
      )
    },
  ]

  useEffect(() => {
    dispatch(loadAllModels())
  }, [loadAllModels])

  useEffect(() => {
    dispatch(loadDiscords({ page, pageSize: 10 }));
  }, [loadDiscords, page])

  const handleDeleteDiscord = (discord) => {
    dispatch(deleteDiscord(discord, handleReloadData));
  }

  const handleReloadData = () => {
    setVisible(false)
    dispatch(loadDiscords({ page, pageSize: 10 }));
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, {replace: true});
  }

  const handleAppendButtonClick = (discord) => {
    setDiscord(discord);
    setShow(true);
  }
  const handleSaveDiscord = () => {
    const { url, desc } = form.getFieldsValue()
    if (discord)
      dispatch(updateDiscord(discord, { url: url.trim(), desc: desc.trim() }, handleReloadData))
    else
      dispatch(createDiscord({ url: url.trim(), desc: desc.trim() }, handleReloadData));
  }

  const handleCreateButtonClick = () => {
    setDiscord();
    form.resetFields();
    setVisible(true);
  }

  const handleEditButtonClick = (record) => {
    setDiscord(record);
    form.setFieldsValue(record);
    setVisible(true);
  }

  const handleAppendModel = (actor) => {
    dispatch(appendModel(discord, actor._id, handleReloadData));
  };

  const handleRemoveModel = (actor) => {
    dispatch(removeModel(discord, actor._id, handleReloadData));
  }
  return (
    <div>
      <Card
        title={
          <div>
            Chat Teams List
          </div>
        }
        extra={
          <div className="flex gap-4">
            <Button icon={<PlusOutlined />} onClick={handleCreateButtonClick}>Create</Button>
          </div>
        }
      >
        <Table
          pagination={{
            position: ["topRight", "bottomRight"],
            showTotal: total => `Total ${total} urls`,
            current: page,
            total: modelProps.discordsCount,
            onChange: handlePageChange,
          }}
          rowKey={row => row._id}
          columns={columns}
          dataSource={modelProps.discords}
        />
      </Card>
      <Modal
        title={discord ? "Edit discord" : "Create discord"}
        open={visible}
        width={800}
        onOk={handleSaveDiscord}
        onCancel={() => setVisible(false)}>
        <Form
          layout="vertical"
          form={form}
          name="control-hooks"
        >
          <Form.Item name="desc" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="url" label="Discord Web Hook" rules={[{ required: true }]}>
            <Input.TextArea 
            autoSize={{minRows: 3}}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={"Models for ChatTeam"}
        width={800}
        open={show}
        onOk={() => setShow(false)}
        onCancel={() => setShow(false)}>
        <Flex gap="large" justify="space-between">
          <List
            header="Models belonged to ChatTeam"
            dataSource={discord ? discord.actors : []}
            renderItem={item =>
              <List.Item actions={[<Button icon={<DeleteOutlined />} onClick={() => handleRemoveModel(item)} />]}>
                {`${item.owner?.name} - ${item.number}. ${item.name}`}
              </List.Item>}
          />
          <List
            header="All models"
            dataSource={modelProps.allModels}
            renderItem={item =>
              <List.Item actions={[<Button icon={<PlusOutlined />} onClick={() => handleAppendModel(item)} />]}>
                {`${item.owner?.name} - ${item.number}. ${item.name}`}
              </List.Item>
            }
            pagination={true}
          />
        </Flex>
      </Modal>
    </div>
  );

};

export default DiscordList;
