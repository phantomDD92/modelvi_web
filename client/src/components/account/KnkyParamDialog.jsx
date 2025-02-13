import { useEffect } from "react";
import {
    Modal,
    Form,
    InputNumber,
} from "antd";

import {
    DEFAULT_POST_COUNT,
    DEFAULT_POST_INTERVAL,
} from "@/utils/const";

const KnkyParamDialog = ({ open, account, onCancel, onUpdate }) => {

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    useEffect(() => {
        if (open && account) {
            form.setFieldsValue({
                postInterval: account.params?.postInterval || DEFAULT_POST_INTERVAL,
                postCount: account.params?.postCount || DEFAULT_POST_COUNT,
            });
        }
    }, [open]);

    const handleOkClick = async () => {
        try {
            const params = await form.validateFields();
            onUpdate(account, params);
        } catch (e) {
            console.error(e);
        }
    }

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
                {/* {postingMode == PostMode.INTERVAL && */}
                <Form.Item
                    name="postInterval"
                    label="Posting Interval"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="min" min={1} max={600} />
                </Form.Item>
                {/* } */}
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

export default KnkyParamDialog;