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
import { PostType, SERVER_PATH } from "@/utils/const";
import Media from "../common/Media";
import StyledInput from "../common/StyledInput";
import { getPlatformName } from "@/utils/string";
import { LuUpload } from "react-icons/lu";

const AgencyScheduleDialog = ({ open, data, modelList, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [mediaName, setMediaName] = useState();
    const [mediaType, setMediaType] = useState();
    const [previewName, setPreviewName] = useState();
    const [previewType, setPreviewType] = useState();
    const [postType, setPostType] = useState(PostType.FREE);
    const [model, setModel] = useState();

    const handleMediaChange = ({ fileList }) => {
        setFileList(fileList);
    }

    // const handlePreviewChange = ({ file }) => {
    //     if (file.status == 'done') {
    //         setPreviewType("image/png");
    //         setPreviewName(file.response.file);
    //         setPreviewType(file.type);
    //     } else if (file.status == "uploading") {
    //         setPreviewName();
    //         setPreviewType();
    //     }
    // }

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { tags, scheduledAt, ...params } = form.getFieldsValue();
            let postTags = [];
            const tagsStr = tags.replaceAll("#", " ").trim()
            if (tagsStr != "") {
                postTags = tagsStr.split(/\s+/);
            }
            let medias = fileList.map(fileInfo => ({ name: fileInfo.response?.file, mode: fileInfo.type }));
            onUpdate({ medias, tags: postTags, type: postType, model, scheduledAt: scheduledAt.toDate(), ...params });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (open && data) {
            const { media, preview, actor, type: postType, tags: postTags, scheduledAt, results, ...params } = data;
            let medias = [];
            if (media) {
                setMediaType(media.mode);
                setMediaName(media.name);
                medias = [media.name]
            } else {
                setMediaName();
                setMediaType();
            }
            if (postType)
                setPostType(postType)
            setModel(actor._id)
            form.setFieldsValue({
                medias,
                platforms: (results || []).map(result => result.account?.platform),
                tags: (postTags || []).map(tag => `#${tag}`).join(" "),
                scheduledAt: moment(scheduledAt),
                ...params
            })
        } else {
            form.resetFields();
            setFileList([]);
            // setMediaName();
            // setMediaType();
            // setPreviewName();
            // setPreviewType();
            setModel();
            setPostType(PostType.FREE)
        }
    }, [data, open]);


    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const getPlatformOptions = (modelList, model) => {
        const target = modelList.find(element => element._id == model);
        if (!target)
            return []
        return target.accounts.map(account => ({ value: account.platform, label: getPlatformName(account.platform) }))
    }
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
                    label="Model"
                    rules={[{ required: true }]}
                >
                    <Select
                        disabled={data != undefined}
                        options={modelList
                            .map(model => ({ value: model._id, label: `[${model.number}] ${model.name}` }))
                        }
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
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
                    // name="medias"
                    // valuePropName="fileList"
                    rules={[{ required: true }]}
                    // getValueFromEvent={normFile}
                >
                    <Upload
                        name="file"
                        multiple
                        action={`${SERVER_PATH}/api/upload`}
                        fileList={fileList}
                        onChange={handleMediaChange}
                    >
                        <Button icon={<LuUpload />}>Upload Media</Button>
                    </Upload>
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

export default AgencyScheduleDialog;