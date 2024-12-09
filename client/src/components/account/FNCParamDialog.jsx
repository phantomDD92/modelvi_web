import { loadAgencyComments, loadAgencyUsers } from "@/redux/dashboard/actions";
import { DEFAULT_COMMENT_INTERVAL, DEFAULT_POST_COUNT, DEFAULT_POST_INTERVAL, DEFAULT_STORY_COUNT, DEFAULT_STORY_INTERVAL, DEFAULT_STORY_REPLACE } from "@/utils/const";
import { Modal, Form, Switch, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FNCParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [commentEnabled, setCommentEnabled] = useState(false);
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
            const params = form.getFieldsValue();
            onUpdate(account, { ...params, commentEnabled });
        } catch (e) {

        }
    }
    useEffect(() => {
        if (open && account) {
            // const { commentInterval, postInterval, storyInterval, storyMaxCount, storyReplaceCount, postCount } = account.params;
            form.setFieldsValue({
                postInterval: account.params?.postInterval || DEFAULT_POST_INTERVAL,
                postCount: account.params?.postCount || DEFAULT_POST_COUNT,
                commentInterval: account.params?.commentInterval || DEFAULT_COMMENT_INTERVAL,
                storyInterval: account.params?.storyInterval || DEFAULT_STORY_INTERVAL,
                storyMaxCount: account.params?.storyMaxCount || DEFAULT_STORY_COUNT,
                storyReplaceCount: account.params?.storyReplaceCount || DEFAULT_STORY_REPLACE,
            });
            setCommentEnabled(account.params?.commentEnabled || false);
        }
    }, [open]);

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
                <Form.Item name="postInterval" label="Post Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={600} addonAfter="min" />
                </Form.Item>
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
                <Form.Item name="storyInterval" label="Story Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={600} addonAfter="min" />
                </Form.Item>
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

export default FNCParamDialog;