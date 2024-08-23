import React, { useEffect, useState } from "react";
import { Card, Table, Tooltip, Popconfirm, Button, Upload, Modal, Form, Input, Flex, Image, Tag, InputNumber } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined, RollbackOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { appendModelContent, clearModelContents, deleteModelContent, getModelContent, loadAllModels, loadSchedules, syncModelContents } from "@/redux/model/actions";
import { useNavigate, useParams } from "react-router-dom";
import { PostType as ScheduleType, SERVER_PATH } from "@/utils/const";
import moment from "moment";



export const ScheduleList = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const [visible, setVisible] = useState(false);
  // const [schedule, setSchedule] = useState();
  const [form] = Form.useForm();
  // const routeParams = useParams()
  // const navigate = useNavigate();
  const page = parseInt(qs.parse(location.search).page) || 1;
  const platform = qs.parse(location.search).platform || "ALL";
  const actor = qs.parse(location.search).actor;

  useEffect(() => {
    dispatch(loadSchedules({ platform, actor, page, pageSize: 10 }))
  }, [loadSchedules, platform, actor, page])

  useEffect(() => {
    dispatch(loadAllModels())
  }, [loadAllModels]);

  const columns = [
    {
      key: 'scheduledAt',
      title: 'Schedule Time',
      dataIndex: 'scheduledAt',
      render: value => moment(value).format("YYYY-MM-DD hh:mm")
    },
    {
      key: 'model',
      title: 'Model',
      dataIndex: 'actor',
      render: value => value ? `${value.number}. ${value.name}` : ''
    },
    {
      key: 'image',
      title: 'Image',
      dataIndex: 'image',
      width: 150,
      render: value => <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
    },
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
    },
    {
      key: 'folder',
      title: 'Folder',
      dataIndex: 'folder',
      width: 100,
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      render: value => value == ScheduleType.PAID ? <Tag color="gold">Paid</Tag> : value == ScheduleType.FAN ? <Tag color="purple">Fan</Tag> : <Tag color="cyan">Free</Tag>,
      width: 100,
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      width: 100,
    },
    {
      key: 'tags',
      title: 'Tags',
      dataIndex: 'tags',
      render: value => value ? <Flex gap="4px 0" wrap>{value.map(tag => <Tag key={tag} color="processing">{tag}</Tag>)}</Flex> : ''
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 150,
      render: (_, record) => (
        <Flex>
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this schedule?"
            okText="Yes"
            cancelText="No"
          // onConfirm={() => handleDeleteContent(record)}
          >
            <Tooltip title="Remove schedule">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Flex>
      )
    },
  ]

  return (
    <div>
      <Card
        title={<div className="h-20 p-6 text-xl"> Scheduled Posts </div>}
        extra={
          <Flex gap="small">
            <Button
              key="create"
              icon={<PlusOutlined />}
            // onClick={handleCreateButtonClick}
            >
              Create
            </Button>
          </Flex>
        }
      >
        <Table
          pagination={{ position: ["topRight", "bottomRight"], showTotal: total => `Total ${total} posts` }}
          rowKey={row => row._id}
          dataSource={modelProps.schedules}
          columns={columns}
        />
      </Card>
      <Modal
        title={"Create Schedule"}
        open={visible}
        onOk={() => handleAppendContent()}
        onCancel={() => setVisible(false)}>
        <Form form={form}>
          <Form.Item
            label="Image"
            name="images"
            valuePropName="fileList"
            rules={[{ required: true }]}
          // getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${SERVER_PATH}/api/upload`}
              headers={{ authorization: 'authorization-text' }}
              listType="picture"
              maxCount={1}
            // beforeUpload={() => false}
            >
              <Button icon={<PlusOutlined />}>
                Click to upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="actor" label="Model" rules={[{ required: true }]}>
            <Select
              options={modelProps.allModels.map(model => ({
                label: `${model.number}. ${model.name}`,
                value: model._id
              }))}
            />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              options={[
                { label: `Free`, value: ScheduleType.FREE },
                { label: `Fan`, value: ScheduleType.FAN },
                { label: `Paid`, value: ScheduleType.PAID },
              ]}
            />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Tags" rules={[{ required: true }]}>
            <Select mode="tags" />
          </Form.Item>
          <Form.Item name="folder" label="Folder">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ScheduleCreateModal = ({ title, open, form, onOk, onCancel }) => {
  return (
    <Modal
      title={"Create Schedule"}
      open={visible}
      onOk={() => handleAppendContent()}
      onCancel={() => setVisible(false)}>
      <Form form={form}>
        <Form.Item
          label="Image"
          name="images"
          valuePropName="fileList"
          rules={[{ required: true }]}
        // getValueFromEvent={normFile}
        >
          <Upload
            name="logo"
            action="/upload.do"
            listType="picture" maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<PlusOutlined />}>
              Click to upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="Tags" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="folder" label="Folder">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ScheduleList;
