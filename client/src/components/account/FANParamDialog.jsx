import { loadAgencyComments, loadAgencyUsers } from "@/redux/dashboard/actions";
import { DEFAULT_COMMENT_INTERVAL, DEFAULT_POST_COUNT, DEFAULT_POST_INTERVAL, DEFAULT_POST_MODE as DEFAULT_POST_MODE, PostMode } from "@/utils/const";
import { Modal, Form, Input, Radio, InputNumber, Switch } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import StyledInput from "../common/StyledInput";

const FANParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [postingMode, setPostingMode] = useState('offset');
    const [commentEnabled, setCommentEnabled] = useState(false);
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const dispatch = useDispatch();
    const homeProps = useSelector(state => state.home);

    useEffect(() => {
        if (open && account) {
            dispatch(loadAgencyComments(account.owner?._id));
            dispatch(loadAgencyUsers(account.owner?._id));
        }
    }, [open, account, loadAgencyComments, loadAgencyUsers, dispatch]);

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { postOffsets, ...params } = form.getFieldsValue();
            const offsets = postOffsets ? postOffsets.split(",").map(str => parseInt(str.trim())) : [1, 21, 51];
            onUpdate(account, { ...params, postOffsets: offsets, commentEnabled });
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
            setCommentEnabled(account.params?.commentEnabled || false);
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
                <div className="text-lg font-medium ml-3 mb-6">Post Settings</div>
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
                        <StyledInput addonAfter="min" />
                    </Form.Item>
                }
                {postingMode == "interval" &&
                    <Form.Item
                        name="postInterval"
                        label="Posting Interval"
                        rules={[{ required: true }]}>
                        <InputNumber addonAfter="min" min={1} max={600} />
                    </Form.Item>
                }
                <Form.Item
                    name="postCount"
                    label="Live Posts"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="posts" min={1} max={10} />
                </Form.Item>
                <div className="flex items-center mb-6 ml-3">
                    <span className="font-medium text-lg mr-3">Comment Settings</span>
                    <Switch onChange={value => setCommentEnabled(value)} />
                </div>
                <Form.Item
                    name="commentInterval"
                    label="Comment Interval"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="min" min={1} max={600} disabled={!commentEnabled} />
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
            </Form>
        </Modal>
    )
}

export default FANParamDialog;