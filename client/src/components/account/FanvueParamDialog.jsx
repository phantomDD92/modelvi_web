import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Modal,
    Form,
    InputNumber,
} from "antd";

import {
    DEFAULT_COMMENT_INTERVAL,
    DEFAULT_POST_COUNT,
    DEFAULT_POST_INTERVAL,
    DEFAULT_POST_MODE,
    PostMode,
} from "@/utils/const";

const FanvueParamDialog = ({ open, account, onCancel, onUpdate }) => {

    const [postingMode, setPostingMode] = useState(DEFAULT_POST_MODE);
    const [commentEnabled, setCommentEnabled] = useState(false);
    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

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

    return (
        <Modal
            open={open}
            title={"Fanvue Account Setting"}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="fanvue-setting"
            >
                <div className="text-lg font-medium ml-3 mb-6">
                    Post Settings
                </div>
                {postingMode == PostMode.INTERVAL &&
                    <Form.Item
                        name="postInterval"
                        label="Posting Interval"
                        rules={[{ required: true }]}>
                        <InputNumber addonAfter="min" min={1} max={600} />
                    </Form.Item>
                }
                <Form.Item
                    name="postCount"
                    label="Keeping Articles"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="articles" min={1} max={10} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FanvueParamDialog;