import { loadComments, loadUsers } from "@/redux/dashboard/actions";
import { DEFAULT_COMMENT_INTERVAL, DEFAULT_POST_COUNT, DEFAULT_POST_INTERVAL, DEFAULT_POST_METHOD as DEFAULT_POST_MODE, PostMode } from "@/utils/const";
import { Modal, Form, Input, Radio, InputNumber, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FANParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [postingMode, setPostingMode] = useState('offset');
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);

    useEffect(() => {
        dispatch(loadComments());
        dispatch(loadUsers());
    }, [loadComments, loadUsers, dispatch]);

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { postOffsets, ...params } = form.getFieldsValue();
            const offsets = postOffsets ? postOffsets.split(",").map(str => parseInt(str.trim())) : [1, 21, 51];
            // console.log(offsets, params);
            onUpdate(account, { ...params, postOffsets: offsets });
        } catch (e) {

        }
    }

    useEffect(() => {
        if (open && account) {
            form.setFieldsValue({
                postInterval: account.params?.postInterval || DEFAULT_POST_INTERVAL,
                postOffsets: account.params?.postOffsets ? account.params?.postOffsets.join(",") : "1, 21, 51",
                postMode: account.params?.postMode || DEFAULT_POST_MODE,
                postCount: account.params?.postCount || DEFAULT_POST_COUNT,
                commentInterval: account.params?.commentInterval || DEFAULT_COMMENT_INTERVAL,
            });
            setPostingMode(account.params?.postMode || DEFAULT_POST_MODE);
        }
    }, [open]);

    const handlePostingOffsetValidation = (_, value) => {
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

    const handlePostingMethodChange = (e) => {
        setPostingMode(e.target.value);
    }
    return (
        <Modal
            title={"Fansly Account Setting"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="fan-setting"
            >
                <Typography.Title level={5}>Post Settings</Typography.Title>
                <Form.Item label="Posting Method" name="postMode">
                    <Radio.Group onChange={handlePostingMethodChange}>
                        <Radio.Button value={PostMode.INTERVAL}>Interval</Radio.Button>
                        <Radio.Button value={PostMode.OFFSET}>Offsets</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {postingMode == "offset" &&
                    <Form.Item
                        name="postOffsets"
                        label="Posting Offsets"
                        rules={[
                            { required: true },
                            {
                                message: 'Please input interger(<60) array. ex : 1,21,51',
                                validator: handlePostingOffsetValidation
                            }
                        ]}>
                        <Input addonAfter="min" />
                    </Form.Item>
                }
                {postingMode == "interval" &&
                    <Form.Item
                        name="postInterval"
                        label="Posting Interval"
                        rules={[{ required: true }]}>
                        <InputNumber addonAfter="min" min={1} max={60} />
                    </Form.Item>
                }
                <Form.Item
                    name="postCount"
                    label="Keeping Articles"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="articles" min={1} max={10} />
                </Form.Item>
                <Typography.Title level={5}>Comment Settings</Typography.Title>
                <Form.Item
                    name="commentInterval"
                    label="Comment Interval"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="min" min={1} max={60} />
                </Form.Item>
                <Form.Item
                    label="Block Users List">
                    <Link to={"/comment"}>{homeProps.users.filter(user => user.status == "block").length} Users Blocked</Link>
                </Form.Item>
                <Form.Item
                    label="Comments List">
                    <Link to={"/comment"}>{homeProps.comments.length} Comments Available</Link>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FANParamDialog;