import { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Flex,
    Form,
    InputNumber,
    Modal,
    Radio,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { F2FStoryType, KnkyStoryType, Platform, SERVER_PATH, StoryType } from "@/utils/const";
import Media from "../common/Media";
import StyledInput from "../common/StyledInput";

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
            let mode = ""
            if (mediaType.includes("image"))
                mode = "image"
            else if (mediaType.includes("video"))
                mode = "video";

            onUpdate({ media, preview, postTags, platforms, mode, ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (open && content) {
            const { image, platforms, media, preview, postTags, knkyStoryType, f2fStoryType, ...params } = content;
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
                f2fStoryType: f2fStoryType || F2FStoryType.NONE,
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

    const isF2F = () => {
        return platforms.includes(Platform.F2F);
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
                    f2fStoryType: F2FStoryType.NONE,
                    knkyStoryType: KnkyStoryType.NONE,
                    knkyStoryPrice: 5,
                }}>
                <Form.Item name="platforms" label="Platforms" rules={[{ required: true }]}>
                    <Checkbox.Group options={[
                        { label: 'F2F', value: Platform.F2F },
                        { label: 'Fancentro', value: Platform.FNC },
                        { label: 'Fansly', value: Platform.FAN },
                        { label: 'Knky', value: Platform.KNKY },
                        { label: 'Maloum', value: Platform.MALOUM },
                        { label: 'OnlyFans', value: Platform.ONLYFANS },
                        { label: 'Fanvue', value: Platform.FANVUE },
                        { label: 'MymFans', value: Platform.MYMFANS },
                        { label: '4Based', value: Platform.FOURBASED },
                    ]} onChange={handlePlatformsChange} />
                </Form.Item>
                {isF2F() &&
                    <Form.Item name="f2fStoryType" label="F2F Story">
                        <Radio.Group
                            buttonStyle="solid"
                            optionType="button"
                            options={[
                                { label: 'None', value: F2FStoryType.NONE },
                                { label: 'Public', value: F2FStoryType.PUBLIC },
                                { label: 'Followers', value: F2FStoryType.FOLLOWERS },
                                { label: 'Fans', value: F2FStoryType.FANS },
                            ]} />
                    </Form.Item>
                }
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
                    <StyledInput />
                </Form.Item>
                <Form.Item name="tags" label="Tags">
                    <StyledInput placeholder="#tag1 #tag2 #tag3" />
                </Form.Item>
                <Form.Item name="folder" label="Folder">
                    <StyledInput />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModelContentDialog;