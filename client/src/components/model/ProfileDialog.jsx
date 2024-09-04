import { Card, Flex, Modal, Form, Input, InputNumber, DatePicker, Row, Col, Upload, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SERVER_PATH } from "@/utils/const";
import { useEffect } from "react";

const ProfileDialog = ({ model, open, onCancel, onUpdate }) => {
    const [form] = Form.useForm();

    const handleOkClick = async () => {
        try {
            await form.validateFields();

        } catch (e) {

        }
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        if (model && model.profile) {
            const { avatar, banner, ...params } = model.profile;
            form.setFieldsValue({
              avatars: avatar ? [{ url: `${SERVER_PATH}/uploads/${avatar}` }] : [],
              banners: banner ? [{ url: `${SERVER_PATH}/uploads/${banner}` }] : [],
              ...params
            });    
        } else {
            form.resetFields();
        }
    }, [model]);
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
                                listType="picture-card"
                                maxCount={1}
                            >
                                <PlusOutlined />
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item labelCol={8} wrapperCol={16} name="banner" label="Banner" >
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
                                    listType="picture-card"
                                    maxCount={1}
                                >
                                    <PlusOutlined />
                                </Upload>
                            </Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item labelCol={8} wrapperCol={16} name="description" label="Bio" >
                            <Input.TextArea autoSize={{ minRows: 10, maxRows: 20 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Card title="Subscription Plan (1 Month)" actions={[<Switch />]}>
                            <Form.Item labelCol={8} wrapperCol={16} name="plan1Title" label="Title" >
                                <Input />
                            </Form.Item>
                            <Form.Item labelCol={8} wrapperCol={16} name="plan1Desc" label="Description" >
                                <Input.TextArea />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item labelCol={8} wrapperCol={16} name="plan1Price" label="Price" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item labelCol={8} wrapperCol={16} name="plan1Discount" label="Discount" >
                                    <InputNumber />
                                </Form.Item>
                            </Flex>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Subscription Plan (3 Months)" actions={[<Switch />]}>
                            <Form.Item labelCol={8} wrapperCol={16} name="plan2Title" label="Title" >
                                <Input />
                            </Form.Item>
                            <Form.Item labelCol={8} wrapperCol={16} name="plan2Desc" label="Description" >
                                <Input.TextArea />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item labelCol={8} wrapperCol={16} name="plan2Price" label="Price" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item labelCol={8} wrapperCol={16} name="plan2Discount" label="Discount" >
                                    <InputNumber />
                                </Form.Item>
                            </Flex>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Subscription Plan (Lifetime)" actions={[<Switch />]}>
                            <Form.Item labelCol={8} wrapperCol={16} name="plan3Title" label="Title" >
                                <Input />
                            </Form.Item>
                            <Form.Item labelCol={8} wrapperCol={16} name="plan3Desc" label="Description" >
                                <Input.TextArea />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item labelCol={8} wrapperCol={16} name="plan3Price" label="Price" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item labelCol={8} wrapperCol={16} name="plan3Discount" label="Discount" >
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