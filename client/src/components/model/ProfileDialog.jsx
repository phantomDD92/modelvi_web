import { Card, Flex, Modal, Form, Input, InputNumber, Image, Button, Row, Col, Upload, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { SERVER_PATH } from "@/utils/const";
import { useEffect, useState } from "react";

const ProfileDialog = ({ model, open, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState()
    const [banner, setBanner] = useState();

    const handleOkClick = async () => {
        try {
            await form.validateFields();
            const { avatars, banners, ...params } = form.getFieldsValue();
            onUpdate(model, { ...params, avatar, banner })
        } catch (e) {
            console.error(e)
        }
    }
    const handleAvatarChange = ({ file }) => {
        if (file.status == 'done') {
            setAvatar(file.response.file);
        }
    };
    const handleBannerChange = ({ file }) => {
        if (file.status == 'done') {
            setBanner(file.response.file);
        }
    };
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        setAvatar();
        setBanner();
        if (model && model.profile) {
            const { avatar, banner, ...params } = model.profile;
            setAvatar(avatar);
            setBanner(banner);
            form.setFieldsValue({ ...params, avatars: [avatar], banners: [banner] })
        } else {
            form.resetFields();
        }
    }, [open]);
    return (
        <Modal
            title={"Profile"}
            width={1000}
            open={open}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <Form
                layout="vertical"
                form={form}
                initialValues={{
                    plan1Enabled: false,
                    plan1Price: 0,
                    plan1Discount: 0,
                    plan2Enabled: false,
                    plan2Price: 0,
                    plan2Discount: 0,
                    plan3Enabled: false,
                    plan3Price: 0,
                    plan3Discount: 0,
                }}
                name="profile">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="Avatar"
                            name="avatars"
                            valuePropName="fileList"
                            rules={[{ required: true }]}
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                name="file"
                                action={`${SERVER_PATH}/api/upload`}
                                headers={{ authorization: 'authorization-text' }}
                                showUploadList={false}
                                maxCount={1}
                                onChange={handleAvatarChange}
                            >
                                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Banner"
                            name="banners"
                            valuePropName="fileList"
                            rules={[{ required: true }]}
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                name="file"
                                action={`${SERVER_PATH}/api/upload`}
                                headers={{ authorization: 'authorization-text' }}
                                showUploadList={false}
                                maxCount={1}
                                onChange={handleBannerChange}
                            >
                                <Button icon={<UploadOutlined />}>Upload Banner</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Image
                            width={400}
                            height={400}
                            src={`${SERVER_PATH}/uploads/${avatar}`}
                            fallback="/img/fallback.png" />
                    </Col>
                    <Col span={12}>
                        <Image
                            width={400}
                            height={400}
                            src={`${SERVER_PATH}/uploads/${banner}`}
                            fallback="/img/fallback.png" />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            labelCol={8}
                            wrapperCol={16}
                            name="description"
                            rules={[{ required: true }]}
                            label="Description" >
                            <Input.TextArea autoSize={{ minRows: 10, maxRows: 20 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Card
                            key="month1"
                            title="Subscription (1 Month)"
                            extra={[<Form.Item name="plan1Enabled"  ><Switch /></Form.Item>]}>
                            <Form.Item
                                name="plan1Title"
                                label="Title" >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="plan1Desc"
                                label="Description" >
                                <Input.TextArea autoSize={{ minRows: 3 }} />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item
                                    name="plan1Price"
                                    label="Price" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item
                                    name="plan1Discount"
                                    label="Discount" >
                                    <InputNumber />
                                </Form.Item>
                            </Flex>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            key="month3"
                            title="Subscription Plan (3 Months)"
                            extra={[<Form.Item name="plan2Enabled"  ><Switch /></Form.Item>]}>
                            <Form.Item name="plan2Title" label="Title" >
                                <Input />
                            </Form.Item>
                            <Form.Item name="plan2Desc" label="Description" >
                                <Input.TextArea autoSize={{ minRows: 3 }} />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item name="plan2Price" label="Price" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item name="plan2Discount" label="Discount" >
                                    <InputNumber />
                                </Form.Item>
                            </Flex>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            key="lifetime"
                            title="Subscription Plan (Lifetime)"
                            extra={[<Form.Item name="plan3Enabled"><Switch /></Form.Item>]}>
                            <Form.Item name="plan3Title" label="Title" >
                                <Input />
                            </Form.Item>
                            <Form.Item name="plan3Desc" label="Description" >
                                <Input.TextArea />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item name="plan3Price" label="Price" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item name="plan3Discount" label="Discount" >
                                    <InputNumber />
                                </Form.Item>
                            </Flex>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ProfileDialog