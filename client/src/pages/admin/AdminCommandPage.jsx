import { StyledInput } from "@/components/common";
import { executeCommandForAdmin, executeShellForAdmin } from "@/redux/admin/actions";
import { Button, Card, Space, Row, Col, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const AdminCommandPage = () => {
  const [command, setCommand] = useState('');
  const [shell, setShell] = useState('');
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const result = useSelector(state => state.admin.shellResult);
  const handleRunCommand = () => {
    setLoading(true);
    dispatch(executeCommandForAdmin(command, () => setLoading(false)));
  }

  const handleRunShell = () => {
    setLoading(true);
    dispatch(executeShellForAdmin(shell, () => {
      setLoading(false);
    }));
    // setResult("This is result\nPlease see")
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
        <Col span={12}></Col>
        <Col span={12}>
          <Typography.Title level={5} >
            Please input shell command to run in server
          </Typography.Title>
          <Space.Compact style={{ width: '100%' }}>
            <StyledInput
              addonBefore="#"
              value={shell}
              onEnter={e => setShell(e.target.value)}
              onChange={e => setShell(e.target.value)} />
            <Button
              type="primary"
              loading={loading}
              onClick={handleRunShell}
            >Run</Button>
          </Space.Compact>
          <div className="mt-10 min-h-[300px]">
            {result?.success ? (
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">#</span>
                  <span className="text-green-500 font-semibold">{shell}</span>
                </div>
                <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {result?.stdout}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500">#</span>
                  <span className="text-red-500 font-semibold">{shell}</span>
                </div>
                <pre className="text-red-400 text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {result?.stderr || result?.error}
                </pre>
              </div>
            )}
          </div>

        </Col>
      </Row>
    </Card>
  </>
}

export default AdminCommandPage;