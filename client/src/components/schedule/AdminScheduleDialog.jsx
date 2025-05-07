import { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
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
import moment from "moment";
import { Platform, PostType, SERVER_PATH } from "@/utils/const";
import Media from "../common/Media";
import StyledInput from "../common/StyledInput";
import { getPlatformName } from "@/utils/string";

const AdminScheduleDialog = ({ open, data, agencyList, modelList, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [mediaName, setMediaName] = useState();
    const [mediaType, setMediaType] = useState();
    const [previewName, setPreviewName] = useState();
    const [previewType, setPreviewType] = useState();
    const [postType, setPostType] = useState(PostType.FREE);
    const [agency, setAgency] = useState();
    const [model, setModel] = useState();

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
            const { medias, previews, tags, scheduledAt, ...params } = form.getFieldsValue();
            let postTags = [];
            const tagsStr = tags.replaceAll("#", " ").trim()
            if (tagsStr != "") {
                postTags = tagsStr.split(/\s+/);
            }
            let media = { name: mediaName, mode: mediaType };
            let preview;
            if (previews && previews.length > 0) {
                preview = { name: previewName, mode: previewType }
            }
            onUpdate({ media, preview, tags: postTags, model, type: postType, scheduledAt: scheduledAt.toDate(), ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (open && data) {
            console.log(data)
            const { media, preview, actor, type: postType, tags: postTags, scheduledAt, owner, results, ...params } = data;
            let medias = [];
            let previews = [];
            if (media) {
                setMediaType(media.mode);
                setMediaName(media.name);
                medias = [media.name]
            } else {
                setMediaName();
                setMediaType();
            }
            if (preview) {
                setPreviewType(preview.mode);
                setPreviewName(preview.name);
                previews = [preview.name];
            }
            if (postType)
                setPostType(postType)
            setAgency(owner._id);
            setModel(actor._id);
            form.setFieldsValue({
                medias,
                previews,
                platforms: (results || []).map(result => result.account?.platform),
                tags: (postTags || []).map(tag => `#${tag}`).join(" "),
                scheduledAt: moment(scheduledAt),
                ...params
            })
        } else {
            form.resetFields();
            setMediaName();
            setMediaType();
            setPreviewName();
            setAgency();
            setModel();
            setPreviewType();
            setPostType(PostType.FREE)
        }
    }, [data, open]);


    const getPlatformOptions = (modelList, model) => {
        const target = modelList.find(element => element._id == model);
        if (!target)
            return []
        return target.accounts.map(account => ({ value: account.platform, label: getPlatformName(account.platform) }))
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal
            title={data ? "Edit Scheduled Post" : "Add Scheduled Post"}
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
                    label="Agency"
                >
                    <Select
                        disabled={data != undefined}
                        options={agencyList
                            .map(agency => ({ value: agency._id, label: `${agency.name}` }))
                        }
                        value={agency}
                        onChange={value => setAgency(value)}
                    />
                </Form.Item>
                <Form.Item
                    label="Model"
                    rules={[{ required: true }]}
                >
                    <Select
                        disabled={data != undefined}
                        options={modelList
                            .filter(model => model.owner == agency)
                            .map(model => ({ value: model._id, label: `[${model.number}] ${model.name}` }))
                        }
                        value={model}
                        onChange={value => setModel(value)}
                    />
                </Form.Item>
                <Form.Item name="platforms" label="Platforms" rules={[{ required: true }]}>
                    <Checkbox.Group options={getPlatformOptions(modelList, model)} />
                </Form.Item>
                <Form.Item
                    label="Date/Time"
                    name="scheduledAt"
                    rules={[{ required: true }]}
                >
                    <DatePicker showTime />
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
                {/* <Form.Item
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
                </Form.Item>
                <Form.Item>
                    <Flex justify="center">
                        <Media
                            width={400}
                            src={previewName}
                            type={previewType} />
                    </Flex>
                </Form.Item> */}
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <StyledInput />
                </Form.Item>
                <Form.Item name="tags" label="Tags">
                    <StyledInput placeholder="#tag1 #tag2 #tag3" />
                </Form.Item>
                <Form.Item name="folder" label="Folder">
                    <StyledInput />
                </Form.Item>
                <Form.Item
                    label="Post Type"
                    rules={[{ required: true }]}
                >
                    <Radio.Group onChange={(e) => setPostType(e.target.value)} value={postType}>
                        <Radio.Button value={PostType.FREE}>Free</Radio.Button>
                        <Radio.Button value={PostType.FAN}>Fans</Radio.Button>
                        <Radio.Button value={PostType.PAID}>Paid</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {postType == PostType.PAID &&
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={5} suffix="€($)" />
                    </Form.Item>
                }
            </Form>
        </Modal>
    )
}

export default AdminScheduleDialog;