import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
    Modal,
    Form,
    Radio,
    Switch,
    Input,
    InputNumber,
    TimePicker,
} from "antd";
import {
    DEFAULT_COMMENT_INTERVAL,
    DEFAULT_POST_COUNT,
    DEFAULT_POST_INTERVAL,
    DEFAULT_POST_OFFSETS,
    DEFAULT_STORY_COUNT,
    DEFAULT_STORY_INTERVAL,
    DEFAULT_STORY_REPLACE,
    Platform,
    PostMode,
} from "@/utils/const";
import { getPlatformName } from "@/utils/string";

import { loadAgencyComments, loadAgencyUsers } from "@/redux/dashboard/actions";
import StyledInput from "../common/StyledInput";

const AccountParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);

    const [postMode, setPostMode] = useState(PostMode.INTERVAL);
    const [storyMode, setStoryMode] = useState(PostMode.INTERVAL);

    const [storyEnabled, setStoryEnabled] = useState(false);
    const [commentEnabled, setCommentEnabled] = useState(false);

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
                    postStart: dayjs(account.params?.postStart || "0:00", "HH:mm"),
                    postLimit: account.params?.postLimit || 10,
                    postCount: account.params?.postCount || DEFAULT_POST_COUNT,
                    commentInterval: account.params?.commentInterval || DEFAULT_COMMENT_INTERVAL,
                    storyMode: account.params?.storyMode || PostMode.INTERVAL,
                    storyOffsets: (account.params?.storyOffsets) ? account.params?.storyOffsets.join(",") : DEFAULT_POST_OFFSETS,
                    storyInterval: account.params?.storyInterval || DEFAULT_STORY_INTERVAL,
                    storyMaxCount: account.params?.storyMaxCount || DEFAULT_STORY_COUNT,
                    storyReplaceCount: account.params?.storyReplaceCount || DEFAULT_STORY_REPLACE,
                });
                setStoryEnabled(account.params?.storyEnabled || false);
                setCommentEnabled(account.params?.commentEnabled || false);
                setPostMode(account.params?.postMode || PostMode.INTERVAL);
                setStoryMode(account.params?.storyMode || PostMode.INTERVAL);
            }
        } else {
            form.resetFields()
        }
    }, [open]);

    useEffect(() => {
        if (open && account) {
            dispatch(loadAgencyComments(account.owner?._id));
            dispatch(loadAgencyUsers(account.owner?._id));
        }
    }, [open, account, loadAgencyComments, loadAgencyUsers, dispatch]);

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
            return Promise.reject('invalid offsets format');
        }
    }

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { postOffsets, storyOffsets, postStart, ...params } = form.getFieldsValue();
            const postOffsetsValue = (postOffsets || DEFAULT_POST_OFFSETS).split(",").map(str => parseInt(str.trim()));
            const storyOffsetsValue = (storyOffsets || DEFAULT_POST_OFFSETS).split(",").map(str => parseInt(str.trim()));
            onUpdate(account,
                {
                    ...params,
                    postOffsets: postOffsetsValue,
                    storyEnabled,
                    storyOffsets: storyOffsetsValue,
                    commentEnabled,
                    postStart: postStart ? postStart.format("HH:mm") : undefined,
                }
            );
        } catch (e) {
            console.error(e);
        }
    }

    const hasCommentSupport = (platform) => (platform == Platform.F2F || platform == Platform.FNC || platform == Platform.FAN || platform == Platform.MALOUM);

    const hasStorySupport = (platform) => (platform == Platform.FNC || platform == Platform.KNKY);

    const hasOffsetsPostingSupport = (platform) => (platform == Platform.F2F || platform == Platform.FNC || platform == Platform.FAN);

    const hasLimitedPostingSupport = (plaform) => plaform == Platform.F2F;

    return (
        <Modal
            open={open}
            title={account ? `Bot Settings for ${getPlatformName(account?.platform)} - ${account?.alias}` : "Bot Settings"}
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
                        {hasOffsetsPostingSupport(account?.platform) &&
                            <Radio.Button key={PostMode.OFFSET} value={PostMode.OFFSET}>Offset</Radio.Button>
                        }
                        {hasLimitedPostingSupport(account?.platform) &&
                            <Radio.Button key={PostMode.LIMITED} value={PostMode.LIMITED}>Limited</Radio.Button>
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
                        <StyledInput addonAfter="min" />
                    </Form.Item>
                }
                {postMode == PostMode.LIMITED &&
                    <Form.Item
                        name="postStart"
                        label="Posting Start Time"
                        rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                }
                {(postMode == PostMode.LIMITED || postMode == PostMode.INTERVAL) &&
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
                {postMode == PostMode.LIMITED &&
                    <Form.Item
                        name="postLimit"
                        label="Posting Limit Per Day"
                        rules={[{ required: true }]}>
                        <InputNumber addonAfter="posts" min={1} max={10} />
                    </Form.Item>
                }
                <Form.Item
                    name="postCount"
                    label="Live Posts"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="posts" min={1} max={10} />
                </Form.Item>
                {hasCommentSupport(account?.platform) &&
                    <>
                        <div className="flex items-center mb-6 ml-3">
                            <span className="font-medium text-lg mr-3">Comment Settings</span>
                            <Switch value={commentEnabled} onChange={value => setCommentEnabled(value)} />
                        </div>
                        <Form.Item
                            name="commentInterval"
                            label="Comment Interval"
                            rules={[{ required: true }]}>
                            <InputNumber addonAfter="min" min={1} max={600} disabled={!commentEnabled} />
                        </Form.Item>
                        <Form.Item
                            // name="commentBlockLists"
                            label="Block Users List">
                            {account?.owner?._id === homeProps.auth._id ?
                                <Link to={"/comment"}>{homeProps.agencyUsers.filter(user => user.status == "block").length} Users Blocked</Link> :
                                <span>{homeProps.agencyUsers.filter(user => user.status == "block").length} Users Blocked</span>
                            }
                        </Form.Item>
                        <Form.Item
                            // name="commentLists"
                            label="Comments List">
                            {account?.owner?._id === homeProps.auth._id ?
                                <Link to={"/comment"}>{homeProps.agencyComments.length} Comments Available</Link> :
                                <span>{homeProps.agencyComments.length} Comments Available</span>
                            }
                        </Form.Item>
                    </>
                }
                {hasStorySupport(account?.platform) &&
                    <>
                        <div className="flex items-center mb-6 ml-3">
                            <span className="font-medium text-lg mr-3">Story Settings</span>
                            <Switch value={storyEnabled} onChange={value => setStoryEnabled(value)} />
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
                                <StyledInput addonAfter="min" disabled={!storyEnabled} />
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
                        {account?.plaform == Platform.FNC &&
                            <Form.Item name="storyReplaceCount" label="Story Replace Count" rules={[{ required: true }]}>
                                <InputNumber min={1} max={10} addonAfter="stories" />
                            </Form.Item>
                        }
                    </>
                }
            </Form>
        </Modal>
    )
}

export default AccountParamDialog;