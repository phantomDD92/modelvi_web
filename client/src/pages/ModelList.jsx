import React, { useEffect, useState } from "react";
import { Card, Table, Tooltip, Popconfirm, Button, Flex, Modal, Form, Input, Tag, InputNumber, DatePicker, Row, Col } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, ReadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createModel, deleteModel, loadModels, updateModel } from "@/redux/model/actions";
import moment from "moment";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';

export const ModelList = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const [visible, setVisible] = useState(false);
  const [model, setModel] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    dispatch(loadModels({ page, pageSize: 10 }));
  }, [loadModels, page])

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
      width: 150,
      dataIndex: 'name',
    },
    {
      key: 'age',
      title: 'Age',
      width: 150,
      dataIndex: 'birthday',
      render: value => moment(value).diff(moment(), 'year', false) || '-'
    },
    {
      key: 'birthplace',
      title: 'Birth Place',
      width: 250,
      dataIndex: 'birthplace'
    },
    {
      key: 'width',
      title: 'Width(kg)',
      dataIndex: 'width',
      width: 150,
      render: value => value || '-'
    },
    {
      key: 'height',
      title: 'Height(cm)',
      dataIndex: 'height',
      width: 150,
      render: value => value || '-'
    },
    {
      key: 'discord',
      title: 'Discord',
      dataIndex: 'discord',
      width: 150,
      render: value => value ? <Tag color="success">Yes</Tag> : <Tag color="error">No</Tag>
    },
    {
      key: 'contents',
      title: 'Contents',
      dataIndex: 'contents',
      width: 150,
      render: value => value ? value.length : '-'
    },
    {
      key: 'accounts',
      title: 'Accounts',
      dataIndex: 'accounts',
      render: value => value.length == 0 ? '-' : value.map(el => el.platform).join(",")
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 150,
      render: (_, record) => (
        <Flex gap="large">
          <Tooltip title="Edit model">
            <Button icon={<EditOutlined />} onClick={() => handleEditButtonClick(record)} />
          </Tooltip>
          <Tooltip title="Read contents">
            <Button icon={<ReadOutlined />} onClick={() => handleContentButtonClick(record)} />
          </Tooltip>
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this model?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteModel(record)}
          >
            <Tooltip title="Remove model">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Flex>
      )
    },
  ]

  const handleContentButtonClick = (model) => {
    navigate(`/model/${model._id}`);
  }


  const handleDeleteModel = (model) => {
    dispatch(deleteModel(model, handleReloadData));
  }

  const handleReloadData = () => {
    dispatch(loadModels({ page, pageSize: 10 }));
  }

  const handleUpdateModel = () => {
    const params = form.getFieldsValue();
    if (model) {
      dispatch(updateModel(model, params, handleReloadData))
    } else {
      dispatch(createModel(params, handleReloadData));
    }
    setModel();
    setVisible(false);
  }

  const handleCreateButtonClick = () => {
    setModel();
    form.resetFields()
    setVisible(true)
  }

  const handleEditButtonClick = (model) => {
    setModel(model);
    form.setFieldsValue(model)
    setVisible(true);
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, {replace: true});
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <div>
      <Card
        title={
          <div className="h-20 p-6 text-xl">
            Model List
          </div>
        }
        extra={
          <Button
            icon={<UserAddOutlined />}
            onClick={handleCreateButtonClick}>
            Create
          </Button>
        }
      >
        <Table
          pagination={{
            position: ["topRight", "bottomRight"],
            showTotal: total => `Total ${total} models`,
            current: page,
            total: modelProps.modelsCount,
            onChange: handlePageChange,
          }}
          rowKey={row => row._id}
          dataSource={modelProps.models}
          columns={columns}
        />
      </Card>
      <Modal
        title={model ? "Update model" : "Create model"}
        width={700}
        open={visible}
        onOk={handleUpdateModel}
        onCancel={() => setVisible(false)}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
        >
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="number" label="Number" rules={[{ required: true }]}>
                <InputNumber min={1} max={1000} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="birthday" label="Birthday" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="birthplace" label="Birth Place">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="height" label="Height" >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="width" label="Width">
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="job" label="Job" >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="study" label="Education">
                <Input placeholder="Education" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item labelCol={8} wrapperCol={16} name="description" label="Bio" >
                <Input.TextArea autoSize={{ minRows: 5, maxRows: 20 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>

  );
};

export default ModelList;
