import { Button, Upload, Modal, Form, Input, Checkbox, Flex, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Platform, SERVER_PATH, StoryType } from "@/utils/const";
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
            const { medias, previews, tags, platforms, story, ...params } = form.getFieldsValue();
            const postTags = tags.replaceAll("#", " ").trim().split(/\s+/);
            let media = [{ name: mediaName, mode: mediaType }];
            let preview;
            if (previews && previews.length > 0) {
                preview = { name: previewName, mode: previewType }
            }
            onUpdate({ media, preview, postTags, platforms, story: platforms.includes(Platform.FNS) ? story : StoryType.NONE, ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (open && content) {
            const { image, platforms, media, preview, postTags, ...params } = content;
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
            form.setFieldsValue({ medias, previews, platforms, tags: postTags.map(tag => `#${tag}`).join(" "), ...params })
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

    const isFancentroStory = () => {
        return platforms.includes(Platform.FNS);
    }

    const handlePlatformsChange = (value) => {
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
                        { label: 'Fansly', value: Platform.FAN },
                        { label: 'Fancentro', value: Platform.FNC },
                        { label: 'Fancentro Story', value: Platform.FNS },
                    ]} onChange={handlePlatformsChange} />

                </Form.Item>
                {isFancentroStory() &&
                    <Form.Item name="story" label="Story Type">
                        <Radio.Group buttonStyle="solid" optionType="button" options={[
                            { label: 'Public', value: StoryType.PUBLIC },
                            { label: 'Followers', value: StoryType.FOLLOWER },
                            { label: 'Subscribers', value: StoryType.SUBSCRIBER },
                        ]} defaultValue={StoryType.PUBLIC} />
                    </Form.Item>
                }
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
                <Form.Item name="tags" label="Tags">
                    <Input placeholder="#tag1 #tag2 #tag3" />
                </Form.Item>
                <Form.Item name="folder" label="Folder">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModelContentDialog;