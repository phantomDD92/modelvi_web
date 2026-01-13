import { StyledInput } from "@/components/common";
import { executeCommandForAdmin } from "@/redux/admin/actions";
import { Button, Card, Space, Row, Col, Typography } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";


const AdminCommandPage = () => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  
  const handleRunCommand = () => {
    setLoading(true);
    dispatch(executeCommandForAdmin(command, () => setLoading(false)));
  }

  return <>
    <Card title="Command">
      <Row gutter={[16, 16]} className="p-8">
        <Col span={12}>
          <Typography.Title level={5} >
            Please input administrative command to run in server
          </Typography.Title>
          <Space.Compact style={{ width: '100%' }}>
            <StyledInput
              // addonBefore="Input Command :"
              value={command}
              onChange={e => setCommand(e.target.value)} />
            <Button
              type="primary"
              loading={loading}
              onClick={handleRunCommand}
            >Run</Button>
          </Space.Compact>
        </Col>
      </Row>
    </Card>
  </>
}

export default AdminCommandPage;