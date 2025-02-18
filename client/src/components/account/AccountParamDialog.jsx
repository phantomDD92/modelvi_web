import { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Radio,
    Switch,
    Input,
    InputNumber,
} from "antd";

import {
    DEFAULT_POST_COUNT,
    DEFAULT_POST_INTERVAL,
    DEFAULT_POST_OFFSETS,
    DEFAULT_STORY_COUNT,
    DEFAULT_STORY_INTERVAL,
    Platform,
    PostMode,
} from "@/utils/const";

const AccountParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [postMode, setPostMode] = useState(PostMode.INTERVAL);
    const [storyEnabled, setStoryEnabled] = useState(false);
    const [storyMode, setStoryMode] = useState(PostMode.INTERVAL);

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    useEffect(() => {
        if (open) {
            if (account) {
                form.setFieldsValue({
                    postMode: account.params?.postMode || PostMode.INTERVAL,
                    postOffsets: (account.params?.postOffsets) ? account.params?.postOffsets.join(",") : DEFAULT_POST_OFFSETS,
                    postInterval: account.params?.postInterval || DEFAULT_POST_INTERVAL,
                    postCount: account.params?.postCount || DEFAULT_POST_COUNT,
                    storyMode: account.params?.storyMode || PostMode.INTERVAL,
                    storyOffsets: (account.params?.storyOffsets) ? account.params?.storyOffsets.join(",") : DEFAULT_POST_OFFSETS,
                    storyInterval: account.params?.storyInterval || DEFAULT_STORY_INTERVAL,
                    storyMaxCount: account.params?.storyMaxCount || DEFAULT_STORY_COUNT,
                });
                setStoryEnabled(account.params?.storyEnabled || false);
                setPostMode(account.params?.postMode || PostMode.INTERVAL);
                setStoryMode(account.params?.storyMode || PostMode.INTERVAL);
            }
        } else {
            form.resetFields()
        }
    }, [open]);

    const handleOffsetsValidation = (_, value) => {
        try {
            if (!/^[0-9\,]+$/.test(value))
                throw new Error("unsupported character")
            const offsets = value.split(",").map(str => parseInt(str.trim()));
            for (var i = 0; i < offsets.length; ++i) {
                if (offsets[i] < 0 || offsets[i] >= 60)
                    throw new Error("invalid offset value");
                if (i < (offsets.length - 1) && offsets[i] >= offsets[i + 1]) {
                    throw new Error("invalid offset sequence");
                }
            }
            return Promise.resolve();
        } catch (error) {
            console.error(error)
            return Promise.reject('invalid offsets format');
        }
    }

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { postOffsets, storyOffsets, ...params } = form.getFieldsValue();
            const postOffsetsValue = (postOffsets || DEFAULT_POST_OFFSETS).split(",").map(str => parseInt(str.trim()));
            const storyOffsetsValue = (storyOffsets || DEFAULT_POST_OFFSETS).split(",").map(str => parseInt(str.trim()));
            onUpdate(account,
                { ...params, storyEnabled, postOffsets: postOffsetsValue, storyOffsets: storyOffsetsValue }
            );
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Modal
            open={open}
            title={"Account Setting"}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="account-setting"
            >
                <div className="text-lg font-medium ml-3 mb-6">
                    Post Settings
                </div>
                <Form.Item label="Posting Method" name="postMode">
                    <Radio.Group onChange={e => setPostMode(e.target.value)}>
                        <Radio.Button key={PostMode.INTERVAL} value={PostMode.INTERVAL}>Interval</Radio.Button>
                        {(account?.platform == Platform.F2F || account?.platform == Platform.FNC) &&
                            <Radio.Button key={PostMode.OFFSET} value={PostMode.OFFSET}>Offset</Radio.Button>
                        }
                        {(account?.platform == Platform.F2F) &&
                            <Radio.Button key={PostMode.OFFSET} value={PostMode.OFFSET}>Offset</Radio.Button>
                        }
                    </Radio.Group>
                </Form.Item>
                {postMode == PostMode.OFFSET &&
                    <Form.Item
                        name="postOffsets"
                        label="Posting Offsets"
                        rules={[
                            { required: true },
                            {
                                message: 'Please input interger(<60) array. ex : 1,21,51',
                                validator: handleOffsetsValidation
                            }
                        ]}>
                        <Input addonAfter="min" />
                    </Form.Item>
                }
                {postMode == PostMode.INTERVAL &&
                    <Form.Item
                        name="postInterval"
                        label="Post Interval"
                        rules={[{ required: true }]}>
                        <InputNumber
                            min={1}
                            max={600}
                            addonAfter="min" />
                    </Form.Item>
                }
                <Form.Item
                    name="postCount"
                    label="Keeping Articles"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="articles" min={1} max={10} />
                </Form.Item>

                {(account?.platform == Platform.FNC || account?.platform == Platform.KNKY) &&
                    <>
                        <div className="flex items-center mb-6 ml-3">
                            <span className="font-medium text-lg mr-3">Story Settings</span>
                            <Switch onChange={value => setStoryEnabled(value)} />
                        </div>
                        <Form.Item label="Story Method" name="storyMode">
                            <Radio.Group onChange={e => setStoryMode(e.target.value)} disabled={!storyEnabled}>
                                <Radio.Button value={PostMode.INTERVAL}>Interval</Radio.Button>
                                <Radio.Button value={PostMode.OFFSET}>Offset</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {storyMode == PostMode.OFFSET &&
                            <Form.Item
                                name="storyOffsets"
                                label="Story Offsets"
                                rules={[
                                    { required: true },
                                    {
                                        message: 'Please input interger(<60) array. ex : 1,21,51',
                                        validator: handleOffsetsValidation
                                    }
                                ]}>
                                <Input addonAfter="min" disabled={!storyEnabled} />
                            </Form.Item>
                        }
                        {storyMode == PostMode.INTERVAL &&
                            <Form.Item name="storyInterval" label="Story Interval" rules={[{ required: true }]}>
                                <InputNumber min={1} max={600} addonAfter="min" disabled={!storyEnabled} />
                            </Form.Item>
                        }
                        <Form.Item name="storyMaxCount" label="Story Max Count" rules={[{ required: true }]}>
                            <InputNumber min={1} max={20} addonAfter="stories" disabled={!storyEnabled} />
                        </Form.Item>
                    </>
                }

            </Form>
        </Modal>
    )
}

export default AccountParamDialog;