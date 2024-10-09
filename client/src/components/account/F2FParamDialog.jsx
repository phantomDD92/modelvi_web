import { Modal, Form, Input, Radio, InputNumber } from "antd";
import { useEffect, useState } from "react";

const F2FParamDialog = ({ open, account, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [postingMode, setPostingMode] = useState('offset');
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

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
        if (open && account && account.params) {
            const { commentInterval, postCount, postOffsets, postInterval, postMode } = account.params;
            form.setFieldsValue({
                commentInterval: commentInterval || 3,
                postInterval: postInterval || 10,
                postOffsets: postOffsets ? postOffsets.join(",") : "1, 21, 51",
                postMode: postMode || "offset",
                postCount: postCount || 3,
            });
            setPostingMode(postMode || "offset");
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
            title={"F2F Account Setting"}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                {...layout}
                form={form}
                name="f2f-setting"
            >
                <Form.Item label="Posting Method" name="postMode">
                    <Radio.Group onChange={handlePostingMethodChange}>
                        <Radio.Button value="offset">Offset</Radio.Button>
                        <Radio.Button value="interval">Interval</Radio.Button>
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
                <Form.Item
                    name="commentInterval"
                    label="Comment Interval"
                    rules={[{ required: true }]}>
                    <InputNumber addonAfter="min" min={1} max={60} />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default F2FParamDialog;