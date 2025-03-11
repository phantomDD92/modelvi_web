import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Modal,
    Form,
    Switch,
    Input,
    InputNumber,
    Radio
} from "antd";
import {
    loadAgencyComments,
    loadAgencyUsers
} from "@/redux/dashboard/actions";
import {
    DEFAULT_COMMENT_INTERVAL,
    DEFAULT_POST_COUNT,
    DEFAULT_POST_INTERVAL,
    DEFAULT_POST_OFFSETS,
    DEFAULT_STORY_COUNT,
    DEFAULT_STORY_INTERVAL,
    DEFAULT_STORY_REPLACE,
    PostMode
} from "@/utils/const";
import StyledInput from "../common/StyledInput";

const FancentroParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [commentEnabled, setCommentEnabled] = useState(false);
    const [postingMode, setPostingMode] = useState(PostMode.INTERVAL);
    const [storyMode, setStoryMode] = useState(PostMode.INTERVAL);
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);

    useEffect(() => {
        if (account) {
            dispatch(loadAgencyComments(account.owner?._id));
            dispatch(loadAgencyUsers(account.owner?._id));
        }
    }, [account, loadAgencyComments, loadAgencyUsers, dispatch]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { postOffsets, storyOffsets, postStart, ...params } = form.getFieldsValue();
            const postOffsetsValue = (postOffsets || DEFAULT_POST_OFFSETS).split(",").map(str => parseInt(str.trim()));
            const storyOffsetsValue = (storyOffsets || DEFAULT_POST_OFFSETS).split(",").map(str => parseInt(str.trim()));
            onUpdate(account,
                { ...params, commentEnabled, postOffsets: postOffsetsValue, storyOffsets: storyOffsetsValue }
            );
        } catch (e) {

        }
    }
    useEffect(() => {
        if (open && account) {
            // const { commentInterval, postInterval, storyInterval, storyMaxCount, storyReplaceCount, postCount } = account.params;
            form.setFieldsValue({
                postMode: account.params?.postMode || PostMode.INTERVAL,
                postOffsets: (account.params?.postOffsets) ? account.params?.postOffsets.join(",") : DEFAULT_POST_OFFSETS,
                postInterval: account.params?.postInterval || DEFAULT_POST_INTERVAL,
                postCount: account.params?.postCount || DEFAULT_POST_COUNT,
                
                commentInterval: account.params?.commentInterval || DEFAULT_COMMENT_INTERVAL,
                
                storyMode: account.params?.storyMode || PostMode.INTERVAL,
                storyOffsets: (account.params?.storyOffsets) ? account.params?.storyOffsets.join(",") : DEFAULT_POST_OFFSETS,
                storyInterval: account.params?.storyInterval || DEFAULT_STORY_INTERVAL,
                storyMaxCount: account.params?.storyMaxCount || DEFAULT_STORY_COUNT,
                storyReplaceCount: account.params?.storyReplaceCount || DEFAULT_STORY_REPLACE,
            });
            setCommentEnabled(account.params?.commentEnabled || false);
            setPostingMode(account.params?.postMode || PostMode.INTERVAL);
            setStoryMode(account.params?.storyMode || PostMode.INTERVAL);
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

    return (
        <Modal
            title={"FNC Account Setting"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="control-hooks"
            >
                <div className="text-lg font-medium ml-3 mb-6">Post Settings</div>
                <Form.Item label="Posting Method" name="postMode">
                    <Radio.Group onChange={e => setPostingMode(e.target.value)}>
                        <Radio.Button value={PostMode.INTERVAL}>Interval</Radio.Button>
                        <Radio.Button value={PostMode.OFFSET}>Offset</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {postingMode == PostMode.OFFSET &&
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
                {postingMode == PostMode.INTERVAL &&
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
                <div className="flex items-center mb-6 ml-3">
                    <span className="font-medium text-lg mr-3">Comment Settings</span>
                    <Switch onChange={value => setCommentEnabled(value)} />
                </div>
                <Form.Item
                    name="commentInterval"
                    label="Comment Interval"
                    rules={[{ required: true }]}>
                    <InputNumber min={1} max={600} addonAfter="min" disabled={!commentEnabled} />
                </Form.Item>
                <Form.Item
                    name="commentBlockLists"
                    label="Block Users List">
                    {account?.owner?._id === homeProps.auth._id ?
                        <Link to={"/comment"}>{homeProps.agencyUsers.filter(user => user.status == "block").length} Users Blocked</Link> :
                        <span>{homeProps.agencyUsers.filter(user => user.status == "block").length} Users Blocked</span>
                    }
                </Form.Item>
                <Form.Item
                    name="commentBlockLists"
                    label="Comments List">
                    {account?.owner?._id === homeProps.auth._id ?
                        <Link to={"/comment"}>{homeProps.agencyComments.length} Comments Available</Link> :
                        <span>{homeProps.agencyComments.length} Comments Available</span>
                    }
                </Form.Item>

                <div className="text-lg font-medium ml-3 mb-6">Story Settings</div>
                <Form.Item label="Story Method" name="storyMode">
                    <Radio.Group onChange={e => setStoryMode(e.target.value)}>
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
                        <StyledInput addonAfter="min" />
                    </Form.Item>
                }
                {storyMode == PostMode.INTERVAL &&
                    <Form.Item name="storyInterval" label="Story Interval" rules={[{ required: true }]}>
                        <InputNumber min={1} max={600} addonAfter="min" />
                    </Form.Item>
                }
                <Form.Item name="storyMaxCount" label="Story Max Count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={20} addonAfter="stories" />
                </Form.Item>
                <Form.Item name="storyReplaceCount" label="Story Replace Count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={10} addonAfter="stories" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FancentroParamDialog;