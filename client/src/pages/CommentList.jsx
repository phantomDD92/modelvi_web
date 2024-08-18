import React, { useEffect, useState } from "react";
import { Button, Card, Form, Popconfirm, Table, Tooltip, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { clearComments, createComment, deleteComment, loadComments } from "@/redux/dashboard/actions";

export const CommentList = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const homeProps = useSelector(state => state.home);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(loadComments())
  }, [loadComments])

  const columns = [
    {
      key: 'text',
      title: 'Text',
      dataIndex: 'text'
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 200,
      render: (_, record) => (
        <Popconfirm
          title="Confirm"
          description="Are you sure to remove this comment?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDeleteComment(record)}
        >
          <Tooltip title="Remove comment">
            <Button shape="circle" icon={<DeleteOutlined />} danger />
          </Tooltip>
        </Popconfirm>
      )
    },
  ]

  const handleCreateComment = async () => {
    try {
      await form.validateFields()
      const { text } = form.getFieldsValue();
      dispatch(createComment(text));
    } catch (e) { }

  }

  const handleClearComments = () => {
    dispatch(clearComments())
  }

  const handleDeleteComment = (comment) => {
    dispatch(deleteComment(comment));
  }

  const handleCreateButtonClick = () => {
    form.resetFields()
    setVisible(true);
  }

  return (
    <div>
      <Card
        title={
          <div className="h-20 p-6 text-xl">
            Comment List
          </div>
        }
        extra={
          <div className="flex gap-4">
            <Popconfirm
              title="Confirm"
              description="Are you sure to remove all proxies?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleClearComments}
            >
              <Button
                danger
                icon={<ClearOutlined />}
              >
                Clear
              </Button>
            </Popconfirm>
            <Button
              icon={<PlusOutlined />}
              onClick={handleCreateButtonClick}
            >
              Create
            </Button>
          </div>
        }
      >
        <Table
          pagination={{ 
            position: ["topRight", "bottomRight"], 
            showTotal: total => `Total ${total} comments` 
          }}
          rowKey={row => row._id}
          columns={columns}
          dataSource={homeProps.comments}
        />
      </Card>
      <Modal
        title="Create comment"
        open={visible}
        onOk={handleCreateComment}
        onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="text" label="Comment" >
            <Input
              placeholder="comment text"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommentList;
