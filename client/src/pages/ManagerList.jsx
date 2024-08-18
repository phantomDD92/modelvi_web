import React, { useEffect, useState } from "react";
import { Card, Table, Tooltip, Popconfirm, Button, Modal, Form, Input } from "antd";
import { DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createManager, deleteManager, loadManagers } from "@/redux/dashboard/actions";
import moment from "moment";
import toast from "react-hot-toast";

export const ManagerList = () => {
  const dispatch = useDispatch()
  const homeProps = useSelector(state => state.home)
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(loadManagers());
  }, [loadManagers])

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name'
    },
    {
      key: 'date',
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 200,
      render: value => moment(value).format("YYYY-MM-DD")
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 200,
      render: (_, record) => (
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this manager?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteManager(record)}
          >
            <Tooltip title="Remove manager">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
      )
    },
  ]

  const handleDeleteManager = (user) => {
    dispatch(deleteManager(user));
  }

  const handlePreCreateModel = () => {
    form.resetFields()
    setVisible(true)
  }

  const handleCreateManager = () => {
    const {name, password, passwordConfirm} = form.getFieldsValue()
    if (password != passwordConfirm) {
      toast.error("please confirm password, correctly");
      form.resetFields();
      return
    }
    dispatch(createManager(name, password))
    setVisible(false)
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
      <Card
        title={
          <div className="h-20 p-6 text-xl">
            Manager List
          </div>
        }
        extra={
          <Button icon={<UserAddOutlined />} onClick={handlePreCreateModel}>Create</Button>
        }
      >
        <Table
          pagination={{ position: ["topRight", "bottomRight"], showTotal: total => `Total ${total} managers` }}
          rowKey={row => row._id}
          dataSource={homeProps.managers}
          columns={columns}
        />
      </Card>
      <Modal
        title={"Create manager"}
        open={visible}
        onOk={handleCreateManager}
        onCancel={() => setVisible(false)}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
        >
          <Form.Item name="name" label="Manager Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Enter Password" rules={[{ required: true }]}>
            <Input type="password"/>
          </Form.Item>
          <Form.Item name="passwordConfirm" label="Confirm Password" rules={[{ required: true }]}>
            <Input type="password"/>
          </Form.Item>
        </Form>
      </Modal>
    </div>

  );
};

export default ManagerList;
