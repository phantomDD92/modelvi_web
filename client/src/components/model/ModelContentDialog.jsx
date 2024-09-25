import { Button, Upload, Modal, Form, Input, Image, Flex } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { SERVER_PATH } from "@/utils/const";

const ModelContentDialog = ({ open, content, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [image, setImage] = useState()
    const handleImageChange = ({ file }) => {
        if (file.status == 'done') {
            setImage(file.response.file);
        }
    }
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { images, ...params } = form.getFieldsValue();
            onUpdate({ image, ...params });
        } catch (e) {

        }
    }
    useEffect(() => {
        if (content) {
            const { image, ...params } = content;
            if (image) {
                setImage(image)
                form.setFieldsValue({ ...params, images: [image] })    
            } else {
                setImage();
                form.setFieldsValue({ ...params, images: [] })    
            }
        } else {
            form.resetFields();
        }
    }, [content]);


    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal
            title={content ? "Edit Content" : "Append Content"}
            width={600}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                form={form}
                initialValues={{
                    tags: "",
                    folder: 'AAA'
                }}>
                <Form.Item
                    label="Image"
                    name="images"
                    valuePropName="fileList"
                    rules={[{ required: true }]}
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="file"
                        action={`${SERVER_PATH}/api/upload`}
                        headers={{ authorization: 'authorization-text' }}
                        showUploadList={false}
                        maxCount={1}
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Flex justify="center">
                        <Image
                            width={400}
                            src={`${SERVER_PATH}/uploads/${image}`}
                            fallback="/img/fallback.png" />
                    </Flex>
                </Form.Item>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="tags" label="Tags">
                    <Input />
                </Form.Item>
                <Form.Item name="folder" label="Folder">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModelContentDialog;