import { loadComments, loadUsers } from "@/redux/dashboard/actions";
import { DEFAULT_COMMENT_INTERVAL, DEFAULT_POST_COUNT, DEFAULT_POST_INTERVAL, DEFAULT_STORY_COUNT, DEFAULT_STORY_INTERVAL, DEFAULT_STORY_REPLACE } from "@/utils/const";
import { Modal, Form, Switch, InputNumber, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FNCParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);

    useEffect(() => {
        dispatch(loadComments());
        dispatch(loadUsers());
    }, [loadComments, loadUsers, dispatch]);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const params = form.getFieldsValue();
            onUpdate(account, params);
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
                <Typography.Title level={5}>Post Settings</Typography.Title>
                <Form.Item name="postInterval" label="Post Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={60} addonAfter="min" />
                </Form.Item>
                <Form.Item
                    name="postCount"
                    label="Keeping Articles"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="articles" min={1} max={10} />
                </Form.Item>
                <Typography.Title level={5}>Story Settings</Typography.Title>
                <Form.Item name="storyInterval" label="Story Interval" rules={[{ required: true }]}>
                    <InputNumber min={1} max={60} addonAfter="min" />
                </Form.Item>
                <Form.Item name="storyMaxCount" label="Story Max Count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={20} addonAfter="stories" />
                </Form.Item>
                <Form.Item name="storyReplaceCount" label="Story Replace Count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={10} addonAfter="stories" />
                </Form.Item>
                <Typography.Title level={5}>Comment Settings</Typography.Title>
                <Form.Item
                    name="commentInterval"
                    label="Comment Interval"
                    rules={[{ required: true }]}>
                    <InputNumber min={1} max={60} addonAfter="min" />
                </Form.Item>
                <Form.Item
                    label="Comments List">
                    <Link to={"/comment"}>{homeProps.comments.length} Comments Available</Link>
                </Form.Item>
                <Form.Item
                    label="Block Users List">
                    <Link to={"/comment"}>{homeProps.users.filter(user => user.status == "block").length} Users Blocked</Link>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FNCParamDialog;