import { useEffect, useState } from "react";
import {
    Button,
    DatePicker,
    Flex,
    Form,
    InputNumber,
    Modal,
    Radio,
    Select,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { F2FPostType, KnkyStoryType, Platform, SERVER_PATH, StoryType } from "@/utils/const";
import Media from "../common/Media";
import StyledInput from "../common/StyledInput";
import { Input } from "postcss";

const AgencyScheduleDialog = ({ open, content, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [mediaName, setMediaName] = useState();
    const [mediaType, setMediaType] = useState();
    const [previewName, setPreviewName] = useState();
    const [previewType, setPreviewType] = useState();
    const [platform, setPlatform] = useState(Platform.F2F);
    const [postType, setPostType] = useState(F2FPostType.PUBLIC);

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
            const { image, platform, media, preview, postTags, ...params } = content;
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
            form.setFieldsValue({
                medias,
                previews,
                platform,
                tags: (postTags || []).map(tag => `#${tag}`).join(" "),
                ...params
            })
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

    const hasFollowerPrice = (platform, type) => {
        switch (platform) {
            case Platform.F2F:
                return type == F2FPostType.ONLY_NON_FANS_MUST_PAY || type == F2FPostType.PAID_FOR_EVERYONE;
            default:
                break
        }
        return false;
    }

    const hasFanPrice = (platform, type) => {
        switch (platform) {
            case Platform.F2F:
                return type == F2FPostType.VIP_POST || type == F2FPostType.PAID_FOR_EVERYONE;
            default:
                break
        }
        return false;
    }

    return (
        <Modal
            title={content ? "Edit Scheduled Post" : "Add Scheduled Post"}
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
                }}>
                <Form.Item
                    label="Platform"
                    rules={[{ required: true }]}>
                    <Radio.Group value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        <Radio.Button value={Platform.F2F}>F2F</Radio.Button>
                        <Radio.Button value={Platform.FNC} disabled>Fancentro</Radio.Button>
                        <Radio.Button value={Platform.FAN} disabled>Fansly</Radio.Button>
                        <Radio.Button value={Platform.KNKY} disabled>Knky</Radio.Button>
                        <Radio.Button value={Platform.MALOUM} disabled>Maloum</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Date/Time"
                    name="scheduledAt"
                    rules={[{ required: true }]}
                >
                    <DatePicker showMinute />
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
                {platform == Platform.FAN && <Form.Item
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
                {platform == Platform.FAN && <Form.Item>
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
                {platform == Platform.F2F &&
                    <Form.Item
                        name="postType"
                        label="Post Type"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: F2FPostType.PUBLIC, label: "Public" },
                                { value: F2FPostType.EXCLUSIVE_FOR_FANS, label: "Exclusive for fans" },
                                { value: F2FPostType.ONLY_NON_FANS_MUST_PAY, label: "Only non-fans must pay" },
                                { value: F2FPostType.PAID_FOR_EVERYONE, label: "Paid for everyone" },
                                { value: F2FPostType.VIP_POST, label: "VIP post" },
                            ]}
                            onChange={value => setPostType(value)}
                        />
                    </Form.Item>
                }
                {hasFollowerPrice(platform, postType) &&
                    <Form.Item
                        name="price"
                        label="Followers Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber />
                    </Form.Item>
                }
                {hasFanPrice(platform, postType) &&
                    <Form.Item
                        name="fanPrice"
                        label="Fans Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber />
                    </Form.Item>
                }
            </Form>
        </Modal>
    )
}

export default AgencyScheduleDialog;