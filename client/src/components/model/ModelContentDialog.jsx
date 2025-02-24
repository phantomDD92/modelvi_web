import { useEffect, useState } from "react";
import { Button, Upload, Modal, Form, Input, Checkbox, Flex, Radio, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { KnkyStoryType, Platform, SERVER_PATH, StoryType } from "@/utils/const";
import Media from "../common/Media";

const ModelContentDialog = ({ open, content, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [mediaName, setMediaName] = useState();
    const [mediaType, setMediaType] = useState();
    const [previewName, setPreviewName] = useState();
    const [previewType, setPreviewType] = useState();
    const [platforms, setPlatforms] = useState([]);
    const [knkyStoryType, setKnkyStoryType] = useState();

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
            const { medias, previews, tags, platforms, ...params } = form.getFieldsValue();
            let postTags = [];
            const tagsStr = tags.replaceAll("#", " ").trim()
            if (tagsStr != "") {
                postTags = tagsStr.split(/\s+/);
            }
            let media = [{ name: mediaName, mode: mediaType }];
            let preview;
            if (previews && previews.length > 0) {
                preview = { name: previewName, mode: previewType }
            }
            onUpdate({ media, preview, postTags, platforms, ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (open && content) {
            const { image, platforms, media, preview, postTags, knkyStoryType, ...params } = content;
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
            knkyStoryType && setKnkyStoryType(knkyStoryType);
            form.setFieldsValue({
                medias,
                previews,
                platforms,
                knkyStoryType: knkyStoryType || KnkyStoryType.NONE,
                tags: (postTags || []).map(tag => `#${tag}`).join(" "),
                ...params
            })
        } else {
            form.resetFields();
            setMediaName();
            setMediaType();
            setPlatforms([]);
            setPreviewName();
            setPreviewType();
            setKnkyStoryType(StoryType.NONE)
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

    const isFancentro = () => {
        return platforms.includes(Platform.FNC);
    }
    const isKnky = () => {
        return platforms.includes(Platform.KNKY);
    }

    const handlePlatformsChange = (value) => {
        setPlatforms(value);
    }

    return (
        <Modal
            title={content ? "Edit Content" : "Append Content"}
            width={700}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                initialValues={{
                    tags: "",
                    folder: 'AAA',
                    story: StoryType.NONE,
                    knkyStoryType: KnkyStoryType.NONE,
                    knkyStoryPrice: 5,
                }}>
                <Form.Item name="platforms" label="Platforms" rules={[{ required: true }]}>
                    <Checkbox.Group options={[
                        { label: 'F2F', value: Platform.F2F },
                        { label: 'Fancentro', value: Platform.FNC },
                        { label: 'Fansly', value: Platform.FAN },
                        { label: 'Fanvue', value: Platform.FANVUE },
                        { label: 'Knky', value: Platform.KNKY },
                        { label: 'Maloum', value: Platform.MALOUM },
                    ]} onChange={handlePlatformsChange} />
                </Form.Item>
                {isFancentro() &&
                    <Form.Item name="story" label="Fancentro Story">
                        <Radio.Group
                            buttonStyle="solid"
                            optionType="button"
                            options={[
                                { label: 'None', value: StoryType.NONE },
                                { label: 'Public', value: StoryType.PUBLIC },
                                { label: 'Followers', value: StoryType.FOLLOWER },
                                { label: 'Subscribers', value: StoryType.SUBSCRIBER },
                            ]} />
                    </Form.Item>
                }
                {isKnky() &&
                    <Form.Item name="knkyStoryType" label="Knky Story">
                        <Radio.Group
                            buttonStyle="solid"
                            optionType="button"
                            options={[
                                { label: 'None', value: StoryType.NONE },
                                { label: 'Public', value: StoryType.PUBLIC },
                                { label: 'Prime', value: StoryType.FOLLOWER },
                                { label: 'PayToView', value: StoryType.SUBSCRIBER },
                            ]}
                            onChange={(e) => setKnkyStoryType(e.target.value)} />
                    </Form.Item>
                }
                {isKnky() && knkyStoryType == KnkyStoryType.PAYTOVIEW &&
                    <Form.Item name="knkyStoryPrice" label="PayToView Price">
                        <InputNumber min={0} />
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