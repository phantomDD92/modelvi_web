import { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Flex,
    Form,
    InputNumber,
    message,
    Modal,
    Radio,
    Upload,
} from "antd";
import { F2FStoryType, KnkyStoryType, Platform, SERVER_PATH, StoryType } from "@/utils/const";
import Media from "../common/Media";
import StyledInput from "../common/StyledInput";
import { LuUpload } from "react-icons/lu";

const beforeUpload = (file) => {
    // Accept specific mime types or extensions
    const isAllowed = /\.(jpe?g|png|mp4|webm|avi)$/i.test(file.name);
    if (!isAllowed) {
        message.error(`${file.name} has an unsupported file type.`);
        return Upload.LIST_IGNORE; // prevents upload
    }
    // Optional: further filter by extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'mov' || ext === 'heic') {
        message.error(`${file.name} is not allowed.`);
        return Upload.LIST_IGNORE;
    }
    // If you want to allow, return true (or just omit)
    return true;
}

const PLATFORM_OPTIONS = [
    { label: 'F2F', value: Platform.F2F },
    { label: 'Knky', value: Platform.KNKY },
    { label: 'Fancentro', value: Platform.FNC },
    { label: 'Fansly', value: Platform.FAN },
    { label: 'Loyalfans', value: Platform.LOYALFANS },
    { label: 'Maloum', value: Platform.MALOUM },
    { label: 'Fanvue', value: Platform.FANVUE },
    { label: '4Based', value: Platform.FOURBASED },
    { label: 'MymFans', value: Platform.MYMFANS },
    { label: 'FetLife', value: Platform.FETLIFE },
    { label: 'OnlyFans', value: Platform.ONLYFANS },
    { label: 'BestFans', value: Platform.BESTFANS },
];

const ModelContentDialog = ({ open, content, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [mediaName, setMediaName] = useState();
    const [mediaType, setMediaType] = useState();
    const [mediaSize, setMediaSize] = useState();
    const [previewSize, setPreviewSize] = useState();
    const [previewName, setPreviewName] = useState();
    const [previewType, setPreviewType] = useState();
    const [platforms, setPlatforms] = useState([]);
    const [postTypes, setPostTypes] = useState({});
    const [knkyStoryType, setKnkyStoryType] = useState();

    const handleMediaChange = ({ file }) => {
        if (file.status == 'done') {
            setMediaType("image/png");
            setMediaName(file.response.file);
            setMediaType(file.type);
            setMediaSize(file.size);
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
            setPreviewSize(file.size);
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
            let media = [{ name: mediaName, mode: mediaType, size: mediaSize }];
            let preview;
            if (previews && previews.length > 0) {
                preview = { name: previewName, mode: previewType, size: mediaSize }
            }
            let mode = ""
            if (mediaType.includes("image"))
                mode = "image"
            else if (mediaType.includes("video"))
                mode = "video";

            onUpdate({ media, preview, postTags, platforms, mode, postTypes, price: form.getFieldValue("price"), ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (open && content) {
            const { image, platforms, media, preview, postTags, knkyStoryType, f2fStoryType, postTypes: savedPostTypes, postType: savedPostType, price: savedPrice, ...params } = content;
            // Load per-platform postTypes (support old single postType format)
            if (savedPostTypes && typeof savedPostTypes === 'object' && Object.keys(savedPostTypes).length > 0) {
                setPostTypes(savedPostTypes);
            } else if (savedPostType && platforms) {
                const converted = {};
                platforms.forEach(p => converted[p] = savedPostType);
                setPostTypes(converted);
            } else {
                setPostTypes({});
            }
            setPlatforms(platforms || []);
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
                price: savedPrice,
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
            setPostTypes({});
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

    const isF2F = () => {
        return platforms.includes(Platform.F2F);
    }
    const isKnky = () => {
        return platforms.includes(Platform.KNKY);
    }

    const handlePlatformsChange = (value) => {
        setPlatforms(value);
        // Initialize postType for newly selected platforms, clean deselected
        const updated = {};
        value.forEach(p => { updated[p] = postTypes[p] || "FREE"; });
        setPostTypes(updated);
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
                    <Checkbox.Group options={PLATFORM_OPTIONS} onChange={handlePlatformsChange} />
                </Form.Item>
                {platforms.length > 0 && (
                    <Form.Item label="Post Type">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {platforms.map(p => {
                                const label = PLATFORM_OPTIONS.find(o => o.value === p)?.label || p;
                                return (
                                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 80, fontSize: 13, fontWeight: 500 }}>{label}</span>
                                        <Radio.Group
                                            size="small"
                                            buttonStyle="solid"
                                            optionType="button"
                                            value={postTypes[p] || "FREE"}
                                            onChange={(e) => setPostTypes({ ...postTypes, [p]: e.target.value })}>
                                            <Radio.Button value="FREE">Free</Radio.Button>
                                            <Radio.Button value="FANS">Fans</Radio.Button>
                                            <Radio.Button value="PAID">Paid</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                );
                            })}
                        </div>
                    </Form.Item>
                )}
                {Object.values(postTypes).includes('PAID') && (
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber min={1} max={500} addonAfter="$" />
                    </Form.Item>
                )}
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
                        beforeUpload={beforeUpload}
                        accept="image/*,video/*"
                        name="file"
                        action={`${SERVER_PATH}/api/upload`}
                        headers={{ authorization: 'authorization-text' }}
                        showUploadList={false}
                        maxCount={1}
                        onChange={handleMediaChange}
                    >
                        <Button icon={<LuUpload />}>Upload Media</Button>
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
                        <Button icon={<LuUpload />}>Upload Preview</Button>
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
