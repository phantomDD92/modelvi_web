import { useEffect, useState } from "react";
import {
    Checkbox,
    Form,
    InputNumber,
    Modal,
    Radio,
} from "antd";
import { KnkyStoryType, Platform, StoryType } from "@/utils/const";

const ModelPlatformDialog = ({ open, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [platforms, setPlatforms] = useState([]);
    const [knkyStoryType, setKnkyStoryType] = useState();

    useEffect(() => {
        form.resetFields();
    }, [open]);

    const handleOkClick = () => {
        form.validateFields()
            .then(() => {
                const params = form.getFieldsValue();
                onUpdate && onUpdate(params);
            })
            .catch((e) => { console.error(e) });
    }

    const isFancentro = () => {
        return platforms.includes(Platform.FNC);
    }
    const isKnky = () => {
        return platforms.includes(Platform.KNKY);
    }

    const handlePlatformsChange = (value) => {
        setPlatforms(value);
    }

    return (
        <Modal
            title={"Change Platforms"}
            width={700}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                form={form}
                className="min-h-[150px]"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                initialValues={{
                    platforms: [],
                    story: StoryType.NONE,
                    knkyStoryType: KnkyStoryType.NONE,
                    knkyStoryPrice: 5,
                }}>
                <Form.Item name="platforms" label="Platforms" rules={[{ required: true }]}>
                    <Checkbox.Group options={[
                        { label: 'F2F', value: Platform.F2F },
                        { label: 'Fancentro', value: Platform.FNC },
                        { label: 'Fansly', value: Platform.FAN },
                        { label: 'Fanvue', value: Platform.FANVUE },
                        { label: 'Knky', value: Platform.KNKY },
                        { label: 'Maloum', value: Platform.MALOUM },
                    ]} onChange={handlePlatformsChange} />
                </Form.Item>
                {isFancentro() &&
                    <Form.Item name="story" label="Fancentro Story">
                        <Radio.Group
                            buttonStyle="solid"
                            optionType="button"
                            options={[
                                { label: 'None', value: StoryType.NONE },
                                { label: 'Public', value: StoryType.PUBLIC },
                                { label: 'Followers', value: StoryType.FOLLOWER },
                                { label: 'Subscribers', value: StoryType.SUBSCRIBER },
                            ]} />
                    </Form.Item>
                }
                {isKnky() &&
                    <Form.Item name="knkyStoryType" label="Knky Story">
                        <Radio.Group
                            buttonStyle="solid"
                            optionType="button"
                            options={[
                                { label: 'None', value: StoryType.NONE },
                                { label: 'Public', value: StoryType.PUBLIC },
                                { label: 'Prime', value: StoryType.FOLLOWER },
                                { label: 'PayToView', value: StoryType.SUBSCRIBER },
                            ]}
                            onChange={(e) => setKnkyStoryType(e.target.value)} />
                    </Form.Item>
                }
                {isKnky() && knkyStoryType == KnkyStoryType.PAYTOVIEW &&
                    <Form.Item name="knkyStoryPrice" label="PayToView Price">
                        <InputNumber min={0} />
                    </Form.Item>
                }
            </Form>
        </Modal>
    )
}

export default ModelPlatformDialog;