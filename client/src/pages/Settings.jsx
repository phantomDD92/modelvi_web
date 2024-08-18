import React, { useEffect } from "react";
import { Card, Form, Input, Row, Col, Switch, InputNumber, Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { loadSetting, updateSetting } from "@/redux/dashboard/actions";

export const Settings = () => {
  const dispatch = useDispatch()
  const homeProps = useSelector(state => state.home)
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleSave = () => {
    const setting = form.getFieldsValue()
    dispatch(updateSetting(setting))
  }

  useEffect(() => {
    dispatch(loadSetting())
  }, [loadSetting])

  useEffect(() => {
    form.setFieldsValue(homeProps.setting)
  }, [homeProps.setting])
  return (
    <Card  title={
          <div className="h-20 p-6 text-xl">
            Settings
          </div>
        }
        extra={
          <Button icon={<SaveOutlined />} onClick={handleSave}>Save</Button>
        }>
      <Row>
        <Col span={6}>
          <Form
            {...layout}
            form={form}
            name="control-hooks"
          // onFinish={onFinish}
          >
            <Form.Item name="headless" label="Headless Mode" rules={[{ required: true }]}>
              <Switch checkedChildren="enabled" unCheckedChildren="disabled"/>
            </Form.Item>
            <Form.Item name="viewWidth" label="View Width" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name="viewHeight" label="View Height" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name="captchaKey" label="Captcha Key" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

export default Settings;
