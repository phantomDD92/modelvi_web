import React, { useEffect, useState } from "react";
import { Card, Table, Tooltip, Popconfirm, Button, Upload, Modal, Form, Input, Flex, Image } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined, RollbackOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { appendModelContent, clearModelContents, deleteModelContent, getModelContent, syncModelContents, updateModelContent } from "@/redux/model/actions";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_PATH } from "@/utils/const";



export const ModelContent = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const [content, setContent] = useState()
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const routeParams = useParams()
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getModelContent(routeParams.modelId))
  }, [getModelContent, routeParams.modelId])

  const columns = [
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
      key: 'tags',
      title: 'Tags',
      dataIndex: 'tags',
    },
    {
      key: 'folder',
      title: 'Folder',
      dataIndex: 'folder',
      width: 100,
    },
    {
      key: 'operation',
      title: 'Operation',
      width: 150,
      render: (_, record) => (
        <Flex gap="small">
          <Tooltip title="Edit content">
            <Button icon={<EditOutlined />} onClick={() => handleEditButtonClick(record)} />
          </Tooltip>
          <Popconfirm
            title="Confirm"
            description="Are you sure to remove this content?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteContent(record)}
          >
            <Tooltip title="Remove content">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Flex>
      )
    },
  ]

  const handleUpdateContent = async () => {
    try {
      await form.validateFields()
      const params = form.getFieldsValue();
      if (content) {
        dispatch(updateModelContent(routeParams.modelId, content, params, () => setVisible(false)));
      } else {
        dispatch(appendModelContent(routeParams.modelId, params, () => setVisible(false)));
      }
    } catch (error) {

    }
  }

  const handleDeleteContent = (content) => {
    dispatch(deleteModelContent(routeParams.modelId, content))
  }

  const handleCreateButtonClick = () => {
    setContent();
    form.resetFields()
    setVisible(true)
  }

  const handleEditButtonClick = (content) => {
    setContent(content);
    form.setFieldsValue(content)
    setVisible(true)
  }

  const handleClearContents = () => {
    dispatch(clearModelContents(routeParams.modelId));
  }

  const handleReupload = () => {
    dispatch(syncModelContents(routeParams.modelId));
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div>
      <Card
        title={
          <div className="h-20 p-6 text-xl">
            Model Content
          </div>
        }
        extra={
          <Flex gap="small">
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={handleCreateButtonClick}>
              Create
            </Button>
            <Popconfirm
              title="Confirm"
              description="Are you sure to clear all contents?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleClearContents}
            >
              <Button
                key="clear"
                icon={<DeleteOutlined />}
                danger>
                Clear
              </Button>
            </Popconfirm>
            {
              modelProps.contentsUpdated &&
              <Button
                key="sync"
                icon={<UploadOutlined />}
                onClick={() => handleReupload()}>
                Sync
              </Button>
            }
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
          pagination={{ position: ["topRight", "bottomRight"], showTotal: total => `Total ${total} contents` }}
          rowKey={row => row._id}
          dataSource={modelProps.contents}
          columns={columns}
        />
      </Card>
      <Modal
        title={content ? "Edit Content" : "Append Content"}
        open={visible}
        onOk={() => handleUpdateContent()}
        onCancel={() => setVisible(false)}>
        <Form form={form}>
          {!content &&
            <Form.Item
              label="Image"
              name="images"
              valuePropName="fileList"
              rules={[{ required: true }]}
              getValueFromEvent={normFile}>
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
          }
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Input />
          </Form.Item>
          <Form.Item name="folder" label="Folder">
            <Input defaultValue="AAA" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelContent;
