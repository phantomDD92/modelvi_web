import React, { useEffect, useState } from "react";
import { Card, Table, Tooltip, Popconfirm, Button, Upload, Modal, Form, Input, Flex, Image, Tag, InputNumber, Select, DatePicker, TimePicker } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { changeSchedule, createSchedule, deleteSchedule, loadAllModels, loadSchedules } from "@/redux/model/actions";
import { Platform, PostType as ScheduleType, SERVER_PATH } from "@/utils/const";
import moment from "moment";
import qs from 'query-string';

export const ScheduleList = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const [visible, setVisible] = useState(false);
  const [schedule, setSchedule] = useState();
  const [schedType, setSchedType] = useState(ScheduleType.FREE);
  const [form] = Form.useForm();
  // const routeParams = useParams()
  // const navigate = useNavigate();
  const page = parseInt(qs.parse(location.search).page) || 1;
  const platform = qs.parse(location.search).platform;
  const actor = qs.parse(location.search).actor;

  useEffect(() => {
    dispatch(loadSchedules({ platform, actor, page, pageSize: 10 }))
  }, [loadSchedules, platform, actor, page])

  useEffect(() => {
    dispatch(loadAllModels())
  }, [loadAllModels]);

  const columns = [
    {
      key: 'file',
      title: 'File',
      dataIndex: 'file',
      width: 80,
      render: value => <Image src={`${SERVER_PATH}/uploads/${value}`} width={100} />
    },
    {
      key: 'scheduledAt',
      title: 'Schedule Time',
      dataIndex: 'scheduledAt',
      width: 150,
      render: value => moment(value).format("YYYY-MM-DD hh:mm")
    },
    {
      key: 'model',
      title: 'Model',
      dataIndex: 'actor',
      width: 150,
      render: value => value ? `${value.number}. ${value.name}` : ''
    },
    {
      key: 'platform',
      title: 'Platform',
      dataIndex: 'platform',
      width: 80,
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      render: value => value == ScheduleType.PAID ? <Tag color="gold">Paid</Tag> : value == ScheduleType.FAN ? <Tag color="purple">Fan</Tag> : <Tag color="cyan">Free</Tag>,
      width: 80,
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      width: 80,
    },
    {
      key: 'folder',
      title: 'Folder',
      dataIndex: 'folder',
      width: 80,
    },
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
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
        <Flex gap="large">
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this schedule?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteSchedule(record)}
          >
            <Tooltip title="Remove schedule">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Change schedule">
            <Button icon={<EditOutlined />} onClick={() => handleChangeClick(record)} />
          </Tooltip>
        </Flex>
      )
    },
  ]

  const handleCreateClick = () => {
    setSchedule();
    form.resetFields();
    setVisible(true)
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleReloadData = () => {
    dispatch(loadSchedules({ platform, actor, page, pageSize: 10 }));
  }

  const handleCreateSchedule = async () => {
    try {
      await form.validateFields()
      const { files, scheduledAt, ...params } = form.getFieldsValue();
      if (schedule) {
        dispatch(changeSchedule(schedule, { ...params, scheduledAt: scheduledAt.toDate() }, handleReloadData))
      } else {
        dispatch(createSchedule({ ...params, file: files[0].response.file, scheduledAt: scheduledAt.toDate() }, handleReloadData))
      }
      setVisible(false)
    } catch (error) {

    }
  }

  const handleDeleteSchedule = (schedule) => {
    dispatch(deleteSchedule(schedule, handleReloadData))
  }

  const handleChangeClick = (schedule) => {
    setSchedule(schedule);
    form.setFieldsValue({ ...schedule, actor: schedule.actor._id, scheduledAt: moment(schedule.scheduledAt) })
    setVisible(true);
  }

  return (
    <div>
      <Card
        title={<div className="h-20 p-6 text-xl"> Scheduled Posts </div>}
        extra={
          <Flex gap="small">
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={handleCreateClick}
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
        onOk={() => handleCreateSchedule()}
        onCancel={() => setVisible(false)}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={form}>
          <Form.Item name="actor" label="Model" rules={[{ required: true }]}>
            <Select
              disabled={schedule}
              options={modelProps.allModels.map(model => ({
                label: `${model.number}. ${model.name}`,
                value: model._id
              }))}
            />
          </Form.Item>
          <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
            <Select
              disabled={schedule}
              options={[
                { label: Platform.ALL, value: Platform.ALL },
                { label: Platform.F2F, value: Platform.F2F },
                { label: Platform.FNC, value: Platform.FNC },
              ]}
            />
          </Form.Item>
          {!schedule && <Form.Item
            label="Image"
            name="files"
            valuePropName="fileList"
            rules={[{ required: true }]}
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${SERVER_PATH}/api/upload`}
              headers={{ authorization: 'authorization-text' }}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<PlusOutlined />}>
                Click to upload
              </Button>
            </Upload>
          </Form.Item>}
          <Form.Item name="scheduledAt" label="Time" rules={[{ required: true }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              onChange={value => setSchedType(value)}
              options={[
                { label: `Free`, value: ScheduleType.FREE },
                { label: `Fan`, value: ScheduleType.FAN },
                { label: `Paid`, value: ScheduleType.PAID },
              ]}
            />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber disabled={schedType != ScheduleType.PAID} min={0} prefix="$" />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Tags" >
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

export default ScheduleList;
