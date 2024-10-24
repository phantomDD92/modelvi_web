import { Button, Upload, Modal, Form, Input, Checkbox, Flex, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Platform, SERVER_PATH } from "@/utils/const";
import Media from "../common/Media";

const ModelContentDialog = ({ open, content, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [mediaName, setMediaName] = useState();
    const [mediaType, setMediaType] = useState();
    const [previewName, setPreviewName] = useState();
    const [previewType, setPreviewType] = useState();
    const [platforms, setPlatforms] = useState([]);

    const handleMediaChange = ({ file }) => {
        if (file.status == 'done') {
            setMediaType("image/png");
            setMediaName(file.response.file);
            setMediaType(file.type);
        } else if (file.status == "uploading") {
            setMediaType();
            setMediaName();
        }
    }

    const handlePreviewChange = ({ file }) => {
        if (file.status == 'done') {
            setPreviewType("image/png");
            setPreviewName(file.response.file);
            setPreviewType(file.type);
        } else if (file.status == "uploading") {
            setPreviewName();
            setPreviewType();
        }
    }

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { medias, previews, ...params } = form.getFieldsValue();
            console.log(medias, previews, params);
            let media = [{ name: mediaName, mode: mediaType }];
            let preview;
            if (previews && previews.length > 0) {
                preview = { name: previewName,mode: previewType }
            }
            onUpdate({ media, preview, ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        console.log("HERE :", open, content);
        if (open && content) {
            const { image, platforms, media, preview, ...params } = content;
            setPlatforms(platforms);
            let medias = [];
            let previews = [];
            if (media && media.length > 0) {
                setMediaType(media[0].mode);
                setMediaName(media[0].name);
                medias = [media[0].name]
            } else if (image) {
                setMediaName(image);
                setMediaType("image/jpg");
                medias = [image]
            } else {
                setMediaName();
                setMediaType();
            }
            if (preview) {
                setPreviewType(preview.mode);
                setPreviewName(preview.name);
                previews = [preview.name];
            }
            form.setFieldsValue({ medias, previews, platforms, ...params })
        } else {
            form.resetFields();
            setMediaName();
            setMediaType();
            setPreviewName();
            setPreviewType();
        }
    }, [content, open]);


    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const isFanslyOnly = () => {
        return platforms.length == 1 && platforms[0] == Platform.FAN;
    }

    const handleChangePlatforms = (value) => {
        setPlatforms(value);
    }

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
                <Form.Item name="platforms" label="Platforms" rules={[{ required: true }]}>
                    <Checkbox.Group options={[
                        { label: 'F2F', value: Platform.F2F },
                        { label: 'Fancentro', value: Platform.FNC },
                        { label: 'Fansly', value: Platform.FAN },
                    ]} onChange={handleChangePlatforms} />
                </Form.Item>
                <Form.Item
                    label="Media"
                    name="medias"
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
                        onChange={handleMediaChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload Media</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Flex justify="center">
                        <Media
                            width={400}
                            src={mediaName}
                            type={mediaType} />
                    </Flex>
                </Form.Item>
                {isFanslyOnly() && <Form.Item
                    label="Preview"
                    name="previews"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="file"
                        action={`${SERVER_PATH}/api/upload`}
                        headers={{ authorization: 'authorization-text' }}
                        showUploadList={false}
                        maxCount={1}
                        onChange={handlePreviewChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload Preview</Button>
                    </Upload>
                </Form.Item>}
                {isFanslyOnly() && <Form.Item>
                    <Flex justify="center">
                        <Media
                            width={400}
                            src={previewName}
                            type={previewType} />
                    </Flex>
                </Form.Item>}
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="postTags" label="Tags">
                    <Select mode="tags" />
                </Form.Item>
                <Form.Item name="folder" label="Folder">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModelContentDialog;